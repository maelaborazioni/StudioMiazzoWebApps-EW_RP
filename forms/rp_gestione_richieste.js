/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"80E069A5-A2E8-4E8D-BED7-150D2C053903",variableType:4}
 */
var vIdLavoratore = -1;

/** 
 * 
 * @param _event
 * @param _triggerForm
 * @param _forceForm
 *
 * @properties={typeid:24,uuid:"E659E9E8-6FB5-40F8-9917-F7BD3C6B6DB5"}
 */
function dc_new(_event, _triggerForm, _forceForm) 
{
	var frm = forms.rp_richiesta_permessi;
	frm.vIdLavoratore = globals.currDip;
	frm.vDal = null;
	frm.vAl = null;
	frm.vIsGestore = false;
	globals.ma_utl_setStatus(globals.Status.EDIT,frm.controller.getName());
	globals.ma_utl_showFormInDialog(frm.controller.getName(),'Richiesta permessi');
	
}

/**
 * @param _event
 * @param _triggerForm
 * @param _forceForm
 *
 * @properties={typeid:24,uuid:"707D89D9-B198-4FDE-B83F-333AE63FCA92"}
 */
function dc_edit(_event,_triggerForm,_forceForm)
{
	if(elements.tab_elenco_richieste.tabIndex == 1)
	{
		var frm = forms.rp_richiesta_permessi_edit;
		if(lavoratori_to_lavoratori_giustificativitesta.getSize() == 0)
		{
			globals.ma_utl_showWarningDialog('Nessuna richiesta da poter modificare','Modifica richiesta permessi');
		    return;
		}
		if (lavoratori_to_lavoratori_giustificativitesta.stato == null) 
		{
			frm.foundset.loadRecords(lavoratori_to_lavoratori_giustificativitesta.idlavoratoregiustificativotesta);
			frm.vDal = foundset.lavoratori_to_lavoratori_giustificativitesta.giorno_dal;
			frm.vAl = foundset.lavoratori_to_lavoratori_giustificativitesta.giorno_al;

			globals.ma_utl_setStatus(globals.Status.EDIT, frm.controller.getName());
			globals.ma_utl_showFormInDialog(frm.controller.getName(), 'Richiesta permessi');

		}
	}
	else
		globals.ma_utl_showWarningDialog('Non è possibile modificare un richiesta già approvata o respinta','Modifica richiesta permessi');
}
/** *
 * @param _event
 * @param _triggerForm
 * @param _forceForm
 * @param _noConfirm
 *
 * @properties={typeid:24,uuid:"47A9A767-34B2-4661-A0DE-CDFEFA7905AF"}
 */
function dc_delete(_event, _triggerForm, _forceForm, _noConfirm)
{
	if(elements.tab_elenco_richieste.tabIndex == 1)
	{	
	    var fs = forms.rp_gestione_richieste_da_evadere_tbl.foundset;
	    var _answer = globals.ma_utl_showYesNoQuestion('Eliminare la richiesta selezionata?','Elimina richiesta');
	    if(_answer)
        {
    	 	if(!fs.deleteRecord(fs.getSelectedIndex()))
    	 	{
    			globals.ma_utl_showWarningDialog('Errore in eliminazione','Elimina richiesta permesso');
    			return;
    	 	}
    	 }
	}
	else
        globals.ma_utl_showWarningDialog('Impossibile eliminare una richiesta già elaborata','Elimina richiesta');    	
}

