/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"3CB0A1B6-391D-476E-9DA2-AD5C49BAE153"}
 */
function confermaSelezioneEvento(event) {

    confermaSelezioneEventoDaAlbero(_idEvSelezionato)
	globals.svy_mod_closeForm(event);
}

/** *
 * @param _firstShow
 * @param _event
 *
 * @properties={typeid:24,uuid:"C5D5EA8F-4DCF-450D-9A3A-BB636EE2C22A"}
 */
function onShowForm(_firstShow, _event) 
{
	bRichiestaPermessi = true;
	refreshTree(_event);
}

/**
 * @AllowToRunInFind
 * 
 * @param {Number} idevento
 * @param {Boolean} [bool]
 *
 * @properties={typeid:24,uuid:"82F5F73D-6D34-4823-8677-7676C41C0EDF"}
 */
function confermaSelezioneEventoDaAlbero(idevento,bool)
{
	/** @type {JSFoundset<db:/ma_presenze/e2eventi>} */    
    var eventiFs = databaseManager.getFoundSet(globals.Server.MA_PRESENZE,globals.Table.EVENTI);
    
    if(eventiFs.find())
    {
    	eventiFs.idevento = idevento;
    	eventiFs.search();
    	
    	AggiornaSelezioneEvento(eventiFs.getRecord(1));
    }	
    
}

/**
 * @param {JSRecord<db:/ma_presenze/e2eventi>} _rec
 * @param {JSEvent} [_event]
 * 
 * @properties={typeid:24,uuid:"556DCE90-4505-4DD9-A80D-3427E7CF2545"}
 */
function AggiornaSelezioneEvento(_rec,_event)
{
	if(_rec == null)
		return;
	
	var frm = forms['rp_richiesta_permessi_tbl_temp'];
	var fs = frm.foundset;
	var fsSize = fs.getSize();
	
	if(fsSize > 1)
	{
		var numRecDaCompilare = 0; 
		for(var r = 1; r <= fsSize; r++)
    	{
    		if(fs.getRecord(r)['idevento'] == null)
    			numRecDaCompilare++;
    	}
		
    	if(numRecDaCompilare)
    	{
			// viene domandato se l'evento deve essere inserito per tutti i giorni  
		    var msg;
		    if(numRecDaCompilare == fsSize)
		    	msg = 'Vuoi inserire l\'evento selezionato su tutti i giorni richiesti?';
		    else
		    	msg = 'Vuoi inserire l\'evento selezionato su tutti i giorni non ancora compilati?'
	    	var answer = globals.ma_utl_showYesNoQuestion(msg,'Seleziona evento');
		    if(answer)
		    {
		    	var idLav = forms.rp_richiesta_permessi.vIdLavoratore;
		    	for(r = 1; r <= fsSize; r++)
		    	{
		    		if(fs.getRecord(r)['idevento'] == null)
		    		{
		    			var isEventoAZeroOre = globals.isEventoAZeroOre(_rec.idevento);
		    			var fascia = globals.getFasciaAssegnataGiorno(idLav,fs.getRecord(r)['giorno']) 
						             || globals.getFasciaProgrammataGiorno(idLav,fs.getRecord(r)['giorno'])
									 || globals.getFasciaTeoricaGiorno(idLav,fs.getRecord(r)['giorno']);
		    			if(fascia.totaleorefascia == 0 && isEventoAZeroOre
		    			   || fascia.totaleorefascia > 0)
		    			{
			    			fs.getRecord(r)['idevento'] = _rec.idevento;
				    		fs.getRecord(r)['descevento'] = _rec.evento_descrizione;
		    			}
		    			else
			    		{
			    			msg = 'L\'evento ' + globals.getCodiceEvento(_rec.idevento) + ' non può essere inserito nel giorno ' + globals.dateFormat(fs.getRecord(r)['giorno'],globals.EU_DATEFORMAT) + ' : controllate le informazioni sulla fascia';
			    			globals.ma_utl_showWarningDialog(msg,'Richiesta ferie permessi');
			    		}
		    		}
		    	}
		    	
		    	return;
		    }
    	}
	}
	
	// l'inserimento avviene solo nella riga selezionata 
	fs['idevento'] = _rec.idevento;
	fs['descevento'] = _rec.evento_descrizione;
	
}

/**
 * 
 * @properties={typeid:24,uuid:"7E45FB4E-5BF8-4A05-8DBF-AA322E67F31B"}
 * @AllowToRunInFind
 */
function refreshTree_old()
{
    arrIdEventi = [];
	for(var e = 0; e < globals._arrIdEvSelezionabiliRP.length; e++)
	{
		if(globals._arrIdEvSelezionabili.indexOf(globals._arrIdEvSelezionabiliRP[e]) != -1)
			arrIdEventi.push(globals._arrIdEvSelezionabiliRP[e]);
	}
	
	if(arrIdEventi.length == 0)
	{
		globals.ma_utl_showWarningDialog('Nessun evento selezionabile!');
		return;
	}
	
	// recupero di tutti gli eventi selezionabili 
	var sqlEv = "SELECT Ev.idEvento,Ev.Evento,'  ' + Ev.Evento + '  ' + Ev.descriz AS Evento_Descrizione,Ev.IdEventoClasse,Ev.IdGruppoEvento,Ev.Note,Ev.OrdineDiEsposizione, " + 
	            "Ev.IdEventoPadre FROM E2Eventi Ev INNER JOIN E2EventiClassi EvCl ON Ev.IdeventoClasse = EvCl.IdEventoClasse " + 
				"WHERE Ev.idEvento IN (" + arrIdEventi.join(',') + ") " + 
				// TODO aggiungere la gestione degli eventi con periodi?
				//"AND EvCl.GestitoConPeriodi = 0 " +
				"AND EvCl.GestitoConStorico = 0 AND Ev.UsaInBudget = 1";
	
				
	var evDs = databaseManager.getDataSetByQuery(globals.Server.MA_PRESENZE,sqlEv,null,-1);
	
	var evDS = evDs.createDataSource('evDS');
		
	// recupero delle classi padre degli eventi ottenuti in precedenza 
	var arrEvPadre = evDs.getColumnAsArray(8);
	/** @type {JSFoundset<db:/ma_presenze/e2_eventipadre>} */    
    var categEvFs = databaseManager.getFoundSet(globals.Server.MA_PRESENZE,'e2_eventipadre');
	if(categEvFs.find())
	{
		categEvFs.idevento = arrEvPadre;
		categEvFs.search();
	}
    categEvFs.sort('ordinediesposizione');    
    
    if(solutionModel.getDataSourceNode(evDS).getCalculation('media_calc') === null)
	{
		solutionModel.getDataSourceNode(evDS).newCalculation('function media_calc(){'+ 
                                            'switch(ideventopadre){' + 
											    'case 612,670,607,854,618 : return \'media:///program_orange.png\';break;' +
			                                    'case 564,565,566,567,568,569,570 : return \'media:///program_orange.png\'; break;' + 
								                'case 571 : return \'media:///program_orange.png\'; break;' +
								                'default : return \'media:///program_orange.png\';' +
											'}' + 
										 '}',JSVariable.TEXT);
	}	
    
	var rel = solutionModel.getRelation('e2eventipadre_to_evDs'); 
	if(rel == null)
	{
		rel = solutionModel.newRelation('e2eventipadre_to_evDs',categEvFs.getDataSource(),evDS,JSRelation.INNER_JOIN);
	    rel.newRelationItem('idevento','=','ideventopadre');
	}
	
	
	if(categEvFs.getSize() === 0)
		elements.eventi_tree.enabled = false;
	else
	{
	    var binding_1 = elements.eventi_tree.createBinding(categEvFs.getDataSource());
	        binding_1.setImageURLDataprovider('calc_media_folder');
	        binding_1.setNRelationName(rel.name);
	        binding_1.setTextDataprovider('descriz');
            binding_1.setMethodToCallOnClick(espandiSelezione,'e2eventipadre_to_evDs.ideventopadre');

        var binding_2 = elements.eventi_tree.createBinding(evDS);
            binding_2.setImageURLDataprovider('media_calc');
            binding_2.setTextDataprovider('evento_descrizione');
            binding_2.setToolTipTextDataprovider('note');
            binding_2.setMethodToCallOnClick(aggiornaIdEventoSelezionato,'idevento');             
            binding_2.setMethodToCallOnDoubleClick(forms.rp_richiesta_permessi_eventi.aggiornaSelezioneEventoDaAlbero,'idevento');
	}
	
	elements.eventi_tree.removeAllRoots();
	elements.eventi_tree.addRoots(categEvFs);
	
}
