
/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"A6AFEC4F-28C2-4B95-A18A-CC7BB1A52D1A"}
 */
function onActionAddParameter(event) 
{
	if(idditta == null)
	{
		globals.ma_utl_showWarningDialog('Selezionare una ditta!');
		return;
	}
	
	var frm = forms.rp_parametri_dtl;
	frm.vIdDitta = idditta;
	frm.vCodDitta = codice;
	frm.vRagioneSociale = ragionesociale;
	frm.vIdTabGiustificativoParametro = null;
	frm.elements.fld_codice.enabled = true;
	frm.isEdit = false;
	globals.ma_utl_showFormInDialog(frm.controller.getName(),'Aggiungi un parametro per la ditta');
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"2EC0CAAD-B030-43B8-8D5B-5FA9413137AD"}
 */
function onActionEditParameter(event) 
{
	var frm = forms.rp_parametri_dtl;
	frm.vIdDitta = idditta;
	frm.vCodDitta = codice;
	frm.vRagioneSociale = ragionesociale;
	frm.vIdTabGiustificativoParametro = foundset.ditte_to_ditte_giustificativiparametri.idtabgiustificativoparametro;
	frm.isEdit = true;
	globals.ma_utl_showFormInDialog(forms.rp_parametri_dtl.controller.getName(),'Modifica il parametro per la ditta');
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"1EE44AA8-C2F0-4188-AFBF-2E587B650FFA"}
 */
function onActionDeleteParameter(event) 
{
	var currRec = forms.rp_parametri_tbl.foundset.getSelectedRecord();
	var success = forms.rp_parametri_tbl.foundset.deleteRecord(currRec);
	if(!success)
	{
		globals.ma_utl_showErrorDialog('Eliminazione del parametro non riuscita','Elimina il parametro selezionato');
	    databaseManager.rollbackTransaction();
	}
	
}

/**
 * TODO generated, please specify type and doc for the params
 * @param _rec
 *
 * @properties={typeid:24,uuid:"711714E0-8C0A-4D64-BA72-133DE407370F"}
 */
function updateDittaParametro(_rec)
{
	globals.lookup(_rec['idditta'],controller.getName());
}
/**
 *
 * @param {JSEvent} _event
 * @param {String} _form
 *
 * @properties={typeid:24,uuid:"753A4FAB-1F7F-4A42-8626-36E5A80A1084"}
 */
function onRecordSelection(_event, _form)
{
	_super.onRecordSelection(_event, _form);
	elements.btn_edit_parameter.enabled = 
	  elements.btn_del_parameter.enabled = foundset.ditte_to_ditte_giustificativiparametri != null
	                                       && foundset.ditte_to_ditte_giustificativiparametri.getSize();
}

/**
 *
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"959080F7-E5A7-41C8-A326-6393197C9889"}
 */
function onHide(event)
{
	globals.ma_utl_setStatus(globals.Status.BROWSE,controller.getName());
	_super.onHide(event);
}
