/**
 * Handle changed data.
 *
 * @param oldValue old value
 * @param newValue new value
 * @param {JSEvent} event the event that triggered the action
 *
 * @returns {Boolean}
 *
 * @private
 *
 * @properties={typeid:24,uuid:"C88F70F6-D533-4B84-A5C1-2F1A42484DFE"}
 */
function onDataChangeGiornoIntero(oldValue, newValue, event)
{
	if(!newValue)
    {
    	/** @type {Date} */
    	var vDalleOre = new Date(foundset['giorno']);
    	foundset['dalleore'] = foundset['alleore'] = vDalleOre;
    }
    else
    {
        foundset['dalleore'] = foundset['alleore'] = null;
    }
    return true;
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"2AB8767F-A6E9-48F6-B9D7-B9133A5C41E3"}
 */
function selezionaEvento(event) 
{	
	if(globals._arrIdEvSelezionabili.length 
		&& (globals._arrIdEvSelezionabiliRP.length > 1
		    || globals._arrIdEvSelezionabiliRP.length ==  1 && globals._arrIdEvSelezionabiliRP[0] != ""))
	   //showLkpAlberoEventi(event);
	   showLkpEventi(event);
	else
		globals.ma_utl_showWarningDialog('Non sono presenti eventi selezionabili','Selezione evento');
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"2EE4CA4C-E713-4037-8178-190A65F906A0"}
 */
function showLkpAlberoEventi(event) 
{	
//	forms.rp_lkp_eventi._destFormName = controller.getName();
//	globals.ma_utl_showFormInDialog(forms.rp_lkp_eventi.controller.getName(),'Eventi selezionabili');
}

/** *
 * @param _event
 * @param _form
 *
 * @properties={typeid:24,uuid:"770DC0D6-D7F0-4BEC-B880-4378CF60F8A8"}
 */
function onRecordSelection(_event, _form) 
{
	_super.onRecordSelection(_event, _form);
}

/**
 * Handle changed data.
 *
 * @param oldValue old value
 * @param newValue new value
 * @param {JSEvent} event the event that triggered the action
 *
 * @returns {Boolean}
 *
 * @private
 *
 * @properties={typeid:24,uuid:"C60892A3-9FC9-4362-A919-218A317D6F48"}
 */
function onDataChangeOre(oldValue, newValue, event) 
{
	foundset['intero'] = 0;
	return true;
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"B2B2FF5C-6845-4B14-89F6-232247B9C2DB"}
 */
function apriInfoFascia(event)
{
	var rec = foundset.getSelectedRecord();
	var objInfoFascia = globals.ottieniInformazioniFasciaGiorno(forms.rp_richiesta_permessi.vIdLavoratore,rec['giorno']);
	var str = '<html>Codice fascia : ' + objInfoFascia['codicefascia'] + '<br/> Altre info : ' + objInfoFascia['descrautogenerata'] + '<br/> Descrizione : ' + objInfoFascia['descrizione'] + '</html>';
	globals.ma_utl_showInfoDialog(str,'Informazioni sulla fascia');
}

/**
 * Callback method for when form is shown.
 *
 * @param {Boolean} firstShow form is shown first time after load
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"EEF86507-F51F-4EB0-A1B8-C2ADE3702635"}
 */
function onShow(firstShow, event) 
{
	_super.onShowForm(firstShow,event);
	
	// rende visibile il pulsante di informazioni sulla tabella di inserimento richieste	
	//elements.btn_info_fascia.visible = forms.rp_richiesta_permessi.vIsGestore;
}

/**
 * Visualizza l'elenco degli eventi selezionabili dall'utente per ferie/permessi
 *  
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"6A4EAB74-A771-4826-A772-AD142C69C13C"}
 */
function showLkpEventi(event)
{
	var params = {
		event : event,
		lookup : 'LEAF_Lkp_Eventi',
		methodToAddFoundsetFilter : 'FiltraEventiSelezionabiliRp',
		allowInBrowse : true,
		methodToExecuteAfterSelection : 'AggiornaSelezioneEventoRp',
		returnFullRecords : true
	};
	
	globals.ma_utl_showLkpWindow(params);
}

/**
 * Filtraggio eventi di ferie/permessi selezionabili dall'utente
 * 
 * @param {JSFoundset} fs
 *
 * @properties={typeid:24,uuid:"F1485456-6BA2-4567-847F-08D10E83DC48"}
 */
function FiltraEventiSelezionabiliRp(fs)
{
	var arrIdEventi = [];
	for(var e = 0; e < globals._arrIdEvSelezionabiliRP.length; e++)
	{
		if(globals._arrIdEvSelezionabili.indexOf(globals._arrIdEvSelezionabiliRP[e]) != -1)
			arrIdEventi.push(globals._arrIdEvSelezionabiliRP[e]);
	}
	
	// recupero di tutti gli eventi selezionabili 
	var sqlEv = "SELECT Ev.idEvento,Ev.Evento,'  ' + Ev.Evento + '  ' + Ev.descriz AS Evento_Descrizione,Ev.IdEventoClasse,Ev.IdGruppoEvento,Ev.Note,Ev.OrdineDiEsposizione, " + 
	            "Ev.IdEventoPadre FROM E2Eventi Ev INNER JOIN E2EventiClassi EvCl ON Ev.IdeventoClasse = EvCl.IdEventoClasse " + 
				"WHERE Ev.idEvento IN (" + arrIdEventi.join(',') + ") " + 
				"AND EvCl.GestitoConStorico = 0 AND Ev.UsaInBudget = 1 " +
				"ORDER BY Ev.Evento";
					
	var evDs = databaseManager.getDataSetByQuery(globals.Server.MA_PRESENZE,sqlEv,null,-1);

	fs.addFoundSetFilterParam('idevento','IN',evDs.getColumnAsArray(1))
	
	return fs;
}

/**
 * @param {JSRecord<db:/ma_presenze/e2eventi>} _rec
 * 
 * @properties={typeid:24,uuid:"A4319F7A-CD6F-44E1-ADD6-B708C71389D4"}
 */
function AggiornaSelezioneEventoRp(_rec)
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
		    			// Ticket 16920
		    			var fascia = globals.ottieniInformazioniFasciaGiorno(idLav,fs.getRecord(r)['giorno']);
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