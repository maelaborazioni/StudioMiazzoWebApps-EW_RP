/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"FCD13372-05C9-432C-AFA0-28EF07AB77EB"}
 */
var callbackFormName = '';
/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"A5BECD31-5AA0-40DA-9832-11C5983EC00F",variableType:4}
 */
var callbackIndex = -1;

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"10E81D66-679C-4805-A8D1-56CF435D3622"}
 */
function confermaEventoRichiesta(event) {
	
	if(_idevento != null &&	_idevento != -1 )
	{
		var fs = forms[callbackFormName].foundset;
		if (vCopiaSucc) {
			for (var i = 1; i <= fs.getSize(); i++) {
				var rec = fs.getRecord(i);
				rec['idevento'] = _idevento;
				rec['codiceproprieta'] = _codprop;
				rec['descevento'] = _descevento;
			}
		} else {
			fs.setSelectedIndex(callbackIndex);
			fs['idevento'] = _idevento;
			fs['codiceproprieta'] = _codprop;
			fs['descevento'] = _descevento;
		}
		globals.ma_utl_setStatus(globals.Status.BROWSE, controller.getName());
		canClose = true;
		globals.svy_mod_closeForm(event);
	}
	else
		globals.ma_utl_showWarningDialog('Controllare i valori inseriti prima di proseguire','Conferma evento richiesta');
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"2E7AC295-D724-4CFA-BEF0-77EA114202DE"}
 */
function annullaRichiestaEvento(event)
{	
	globals.ma_utl_setStatus(globals.Status.BROWSE,controller.getName());
	canClose = true;
	globals.svy_mod_closeForm(event);	
}

/**
 * @AllowToRunInFind 
 * @properties={typeid:24,uuid:"A28DEFA0-80AC-4BBD-A3CA-F3620AA23610"}
 */
function aggiornaSelezioneEventoDaAlbero(returnDataProvider, tableName, mouseX, mouseY){
	
	/** @type {JSFoundSet<db:/ma_presenze/e2eventi>} */    
    var eventiFs = databaseManager.getFoundSet(globals.Server.MA_PRESENZE,globals.Table.EVENTI);
    
    if(eventiFs.find())
    {
    	eventiFs.idevento = returnDataProvider;
    	eventiFs.search();
    	
   	   if(application.getWindow('win_lkp_albero_eventi'))
   	      application.getWindow('win_lkp_albero_eventi').hide();
    	    	
   	   AggiornaSelezioneEvento(eventiFs.getRecord(1));
 
    }
}

/**
 * @param {JSRecord<db:/ma_presenze/e2eventi>} _rec
 * @param {JSEvent} [_event]
 * 
 * @properties={typeid:24,uuid:"C6289960-E568-41EA-8DDD-1A25EA1DE6CA"}
 */
function AggiornaSelezioneEvento(_rec,_event)
{
	if(_rec == null)
		return;
	
	_idevento = _rec['idevento'];
	_ideventoclasse = _rec['ideventoclasse'];
	
    if (globals.needsCertificate(_ideventoclasse))
    {
		// TODO gestione richiesta permessi in casi di inserimento richiesta gestita con storico	
	    // Open the form to handle the correct type of certificate
//		if(_event != null)
//			globals.svy_mod_closeForm(_event);
//		else
//		    application.getWindow('win_modifica_evento').hide();
//			
//		globals.showStorico(_ideventoclasse, _giornoEvento, forms.giorn_header.idlavoratore, forms.giorn_header.idditta);
		
	}
		     
	AggiornaProprietaEvento(_rec);
			
}

/**
 * @AllowToRunInFind
 * 
 * @param {JSRecord<db:/ma_presenze/e2eventi>} _rec
 *
 * @properties={typeid:24,uuid:"7144B0F5-D3DA-4074-9617-D24FA34D14CA"}
 */
function AggiornaProprietaEvento(_rec) 
{
	_idevento = _rec['idevento'];
	_codevento = _rec['evento'];
	_descevento = _rec['descriz'];
	_ideventoclasse = _rec['ideventoclasse'];

	if (_rec.e2eventi_to_e2eventiclassi && (_rec.e2eventi_to_e2eventiclassi.tipo == 'O'
		                                      || _rec.e2eventi_to_e2eventiclassi.tipo == 'S'))
	{
		if(!_isInModifica)
		   vCoperturaOrarioTeorico = true;
				
	}
	else
	{
		if(!_isInModifica)
		   vCoperturaOrarioTeorico = false;
				
	}

	// Seleziona la prima proprietà disponibile per l'evento selezionato
	// nel giorno selezionato
	FiltraProprietaRicSelezionabili(_idevento)

	var proprietaFoundset = _rec.e2eventi_to_e2eventiclassiproprieta;

	if (proprietaFoundset.find()) 
	{
		proprietaFoundset.ideventoclasseproprieta = _arrIdPropSelezionabili
		proprietaFoundset.search()

		if (proprietaFoundset && proprietaFoundset.getSize() > 0) 
		{
			if(_oldIdPropCl)
			{
	           globals.lookupFoundset(_oldIdPropCl,proprietaFoundset);
			}
			_codprop = proprietaFoundset.codiceproprieta;
			_descprop = proprietaFoundset.descrizione;
		
			abilitaProprieta(true);
		}
		else
		{
			_codprop = "";
			_descprop = "";
			
			abilitaProprieta(false);
		}
		
		globals.svy_nav_setFieldsColor(controller.getName(),globals.Status.EDIT);
	} 
	else
	{
		globals.ma_utl_showErrorDialog('Cannot go to find mode : proprieta', 'Servoy Error')
		_codprop = "";
		_descprop = "";
	}
}

/**
 * @param {Number} idEvento
 *
 * @properties={typeid:24,uuid:"CAE1CA9D-07A1-45DC-A0BA-AE22D6D99F0F"}
 */
function FiltraProprietaRicSelezionabili(idEvento)
{	
	var bReturn = false;
	var url = globals.WS_EVENT + "/Event32/FiltraProprieta";
	var params = globals.inizializzaParametriFiltroEvento(
					globals.TipoGiornaliera.NORMALE
					,globals._tipoConnessione
					,[forms.rp_gestione_richieste.idlavoratore]
					);
	
	var response = globals.getWebServiceResponse(url, params);

	if(response && response.ReturnValue)
	{
		bReturn = true;
		/** @type {Array} */
	   _arrIdPropSelezionabili = response.ReturnValue;
	}	
	return bReturn;
}

/**
 * @AllowToRunInFind
 * 
 * @param {Number} _idevento
 *
 * @properties={typeid:24,uuid:"619BD2E8-BFCB-4C16-8284-53E10C5BE9E0"}
 */
function confermaSelezioneEventoDaAlbero(_idevento)
{
	/** @type {JSFoundSet<db:/ma_presenze/e2eventi>} */    
    var eventiFs = databaseManager.getFoundSet(globals.Server.MA_PRESENZE,'e2eventi');
    
    if(eventiFs.find())
    {
    	eventiFs.idevento = _idevento;
    	eventiFs.search();
    	
    	AggiornaSelezioneEvento(eventiFs.getRecord(1));
    }	
    
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"9C141729-A96B-4431-A721-D607E00E0F13"}
 */
function showLkpAlberoEventi(event) 
{
//	forms.giorn_lkp_eventi._destFormName = controller.getName();
	forms.rp_lkp_eventi._destFormName = controller.getName();
	globals.ma_utl_showFormInDialog(forms.rp_lkp_eventi.controller.getName(),'Eventi selezionabili');
}

/**
 * @param {String} oldValue
 * @param {String} newValue
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"0BC2A191-C54C-4815-929F-EEB8F714A50D"}
 * @AllowToRunInFind
 */
function onDataChangeEventoRP(oldValue, newValue, event) {

	if(newValue == null || newValue == '')
	{
		globals.ma_utl_showWarningDialog('Inserire un valore per il codice evento desiderato','Aggiorna evento per richiesta di ferie e permessi');
		return false;
	}
	
	// escape character \ per corsi aziendali
	var uriEn = escape(newValue);
	if(uriEn == escape('\\'))
	   newValue = '\\\\';
	
	// filtraggio eventi selezionabili per il lavoratore richiesto 
	globals.FiltraEventiSelezionabili(forms.rp_richiesta_permessi.vIdLavoratore,
		                              forms.rp_richiesta_permessi.vDal.getFullYear() * 100 + forms.rp_richiesta_permessi.vDal.getMonth() + 1,
									  globals.TipoGiornaliera.BUDGET);
	
	globals.FiltraEventiSelezionabiliModulo(forms.rp_richiesta_permessi.vIdLavoratore,globals.CategoriaSW.RFP);
	//globals.FiltraEventiSelezionabiliRP();
	
	/** @type {JSFoundSet<db:/ma_presenze/e2eventi>} */
	var _foundset = databaseManager.getFoundSet(globals.Server.MA_PRESENZE,
		                                        globals.Table.EVENTI);

	_oldIdEvento = _idevento;
	_oldIdPropCl = _idpropcl;
	_oldCodProp = _codprop;

	// Filtra gli eventi selezionabili
	if(_foundset.find())
    {
    	_foundset.evento = newValue;
    	_foundset.e2eventi_to_e2eventiclassi.tipo = 'S';
    	_foundset.usainbudget = 1;    	
    }
	
	if (_foundset.search() == 1 && 
	   (globals._arrIdEvSelezionabili.lastIndexOf(_foundset.idevento) != -1  ||
		   globals._arrIdEvSelezionabiliRP.lastIndexOf(_foundset.idevento) != -1))
	{

		_idevento = _foundset['idevento'];
		_descevento = _foundset['descriz'];
		_ideventoclasse = _foundset['ideventoclasse'];
			
		AggiornaSelezioneEventoRP(_foundset.getSelectedRecord());
		
	} else 
	{
		_codevento = oldValue;
		showLkpAlberoEventi(event);
	}

	return true;
}

/**
 * @param {JSRecord<db:/ma_presenze/e2eventi>} _rec
 * @param {JSEvent} [_event]
 * 
 * @properties={typeid:24,uuid:"37FD2737-A76E-4730-817C-FA9CCF6C36EC"}
 */
function AggiornaSelezioneEventoRP(_rec,_event){
	
	_idevento = _rec['idevento'];
	_ideventoclasse = _rec['ideventoclasse'];
		        			
}