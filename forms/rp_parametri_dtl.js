/**
 * @type {Number}
 * 
 * @properties={typeid:35,uuid:"560ADF85-62E2-4F78-8768-59B59A7D1C00",variableType:8}
 */
var vIdDitta = null;
/**
 * @type {Number}
 * 
 * @properties={typeid:35,uuid:"874F765A-BA02-49C9-8E60-0074452513E6",variableType:8}
 */
var vCodDitta = null;
/**
 * @type {String}
 * 
 * @properties={typeid:35,uuid:"791F1E9F-EF7B-4BAF-9D91-70FB6F64D923"}
 */
var vRagioneSociale = null;
/**
 * @type {String}
 * 
 * @properties={typeid:35,uuid:"B2E3A806-7FB6-4130-A86C-96989528F6BE"}
 */
var vCodParameter = null;
/**
 * @type {String}
 * 
 * @properties={typeid:35,uuid:"A8F1D9E1-BFDB-4A3E-98D4-9EB03C80611F"}
 */
var vDescParameter = null;
/**
 * @type {String}
 * 
 * @properties={typeid:35,uuid:"49ABD9E9-E057-45BD-8C29-EB75DC4B3587"}
 */
var vValueParameter = null;
/**
 * @type {Number}
 * 
 * @properties={typeid:35,uuid:"AF1A321B-4798-44F5-8143-0B9D90BA1231",variableType:8}
 */
var vIdTabGiustificativoParametro = null;
/**
 * @type {String}
 * 
 * @properties={typeid:35,uuid:"63C286E6-1D98-4F81-A885-94A5352D5D9E"}
 */
var vCodParameterValue = null;
/**
 * @type {String}
 * 
 * @properties={typeid:35,uuid:"9EBECB5E-5D30-45ED-80A6-D8534E5B3049"}
 */
var vDescParameterValue = null;
/**
 * @type {Number}
 * 
 * @properties={typeid:35,uuid:"E8E18474-40C7-4974-8F1A-FBD45E32A617",variableType:8}
 */
var vIdTabGiustificativoParametroValore = null;
/**
 * @type {Boolean}
 * 
 * @properties={typeid:35,uuid:"21E451B1-533D-4401-9114-85EF9D9525DC",variableType:-4}
 */
var isEdit = false;
/**
 * Handle changed data.
 *
 * @param {Number} oldValue old value
 * @param {Number} newValue new value
 * @param {JSEvent} event the event that triggered the action
 *
 * @returns {Boolean}
 *
 * @private
 *
 * @properties={typeid:24,uuid:"BEB3E4C1-39EC-49AD-BDDE-753C34A78561"}
 */
function onDataChangeParameter(oldValue, newValue, event) 
{
	vCodParameter = globals.getCodiceParametro(newValue);
	vDescParameter = globals.getDescrizioneParametro(newValue);
	
	var sqlVal = "SELECT idTabGiustificativoParametroValore,Codice,Descrizione FROM Tab_GiustificativiParametriValori \
	              WHERE idTabGiustificativoParametro = ? ORDER BY Ordine ASC";
	var parVal = [newValue];
	var dsVal = databaseManager.getDataSetByQuery(globals.Server.MA_COMMON,sqlVal,parVal,-1);
	
	var arrDisplay = [];
	var arrReal = [];
	for(var v = 1; v <= dsVal.getMaxRowIndex(); v++)
	{
		arrDisplay.push(dsVal.getValue(v,2) + ' - ' + dsVal.getValue(v,3));
		arrReal.push(dsVal.getValue(v,1));
	}
	application.setValueListItems('vls_giustificativi_parametri_valori',arrDisplay,arrReal);
	
	return true;
}

/**
 * Handle changed data.
 *
 * @param {Number} oldValue old value
 * @param {Number} newValue new value
 * @param {JSEvent} event the event that triggered the action
 *
 * @returns {Boolean}
 *
 * @private
 *
 * @properties={typeid:24,uuid:"01A694D0-1D0E-4B28-A035-5DC66CAC2E17"}
 */
function onDataChangeParameterValue(oldValue, newValue, event) 
{
	vCodParameterValue = globals.getCodiceParametroValore(newValue);
	vDescParameterValue = globals.getDescrizioneParametroValore(newValue);
	
	return true;
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"42C1989B-6A16-4661-8AC5-34C69297FCD5"}
 */
function onActionAnnulla(event)
{
	globals.ma_utl_setStatus(globals.Status.BROWSE,controller.getName());
	globals.svy_mod_closeForm(event);
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"A99FDE13-6741-493B-8C36-CD00744FEE14"}
 * @AllowToRunInFind
 */
function onActionConferma(event) 
{
	try
	{
		if(vIdTabGiustificativoParametroValore == null)
			throw new Error('Nessun valore selezionato per il parametro desiderato');
			
		/** @type {JSFoundset<db:/ma_anagrafiche/ditte_giustificativiparametri>}*/
		var fs = databaseManager.getFoundSet(globals.Server.MA_ANAGRAFICHE,globals.Table.DITTE_GIUSTIFICATIVI_PARAMETRI);
				
		// nel caso di modifica di un parametro esistente
		if(isEdit)
		{
			if(fs.find())
			{
				fs.idditta = vIdDitta;
				fs.idtabgiustificativoparametro = vIdTabGiustificativoParametro;
				if(fs.search())
				{
         			databaseManager.startTransaction();
					fs.valore = vCodParameterValue;
					
					if(!databaseManager.commitTransaction())
						throw new Error('Errore durante la modifica del valore del parametro.');
					forms.rp_parametri.onRecordSelection(event,forms.rp_parametri.controller.getName());
				}
			}
			else
				throw new Error('Errore durante la verifica del parametro selezionato');
		}
		// in caso di nuovo parametro verifica che lo stesso parametro non sia già stato impostato 
		else
		{
			if(fs.find())
			{
				fs.idditta = vIdDitta;
				fs.idtabgiustificativoparametro = vIdTabGiustificativoParametro;
				if(fs.search())
				{
					globals.ma_utl_showWarningDialog('Esiste già una precedente impostazione per il parametro selezionato.<br/>\
					                                  Modificare quello esistente.','Inserimento nuovo parametro');
					return;
				}
				
				databaseManager.startTransaction();
				var recIndex = fs.newRecord();
				if(recIndex != -1)
				{
					var rec = fs.getRecord(recIndex);
					rec.idditta = vIdDitta;
					rec.idtabgiustificativoparametro = vIdTabGiustificativoParametro;
					rec.valore = vCodParameterValue;
					
					if(!databaseManager.commitTransaction())
						throw new Error('Errore durante l\'inserimento del parametro.');
					forms.rp_parametri.onRecordSelection(event,forms.rp_parametri.controller.getName());
					
				}
				else
					throw new Error('Errore durante la creazione del nuovo record.');
			}
			else
				throw new Error('Errore durante la verifica del parametro selezionato');
						
		}
				
	}
	catch(ex)
	{
		application.output(ex.message, LOGGINGLEVEL.ERROR);
		databaseManager.rollbackTransaction();
		globals.ma_utl_showErrorDialog(ex.message);		
	} 
	finally
	{
		databaseManager.setAutoSave(false);
	}	
	globals.ma_utl_setStatus(globals.Status.BROWSE,controller.getName());
	globals.svy_mod_closeForm(event);
}

/**
 *
 * @param {Boolean} _firstShow
 * @param {JSEvent} _event
 *
 * @properties={typeid:24,uuid:"C3AB7F1B-4AEB-4B01-BA66-BAF1A12D7425"}
 */
function onShowForm(_firstShow, _event) 
{
	_super.onShowForm(_firstShow, _event);
	if(isEdit)
	{
		elements.fld_codice.enabled = false;
	    onDataChangeParameter(null,vIdTabGiustificativoParametro,_event);
	}
	globals.ma_utl_setStatus(globals.Status.EDIT,controller.getName());
}

