/** @type {Date}
 * 
 * @properties={typeid:35,uuid:"C8141191-62FF-42EE-AD2A-652118AD103A",variableType:93}
 */
var vDallaData = null;

/** @type {Date}
 * 
 * @properties={typeid:35,uuid:"676FE21D-FD74-42F8-9C7C-EEFDD5F7377E",variableType:93}
 */
var vAllaData = null;

/**
 * @type {Number}
 * 
 * @properties={typeid:35,uuid:"7D3B8779-C811-43FF-8359-6C5D9752FFB7",variableType:8}
 */
var vIdDitta = null;

/**
 * @type {Number}
 * 
 * @properties={typeid:35,uuid:"60EEED05-E6D6-4F5C-A95B-780AAE98802C",variableType:8}
 */
var codiceDitta = null;

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"893814B2-B6FF-4A4C-B4F2-0B09C3CA8B8D"}
 */
var ragioneSocialeDitta = '';

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"7C306A20-7FA1-4C1D-BA4D-58D882DE4730",variableType:4}
 */
var vChkSoloDitta = 0;

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"B5CBB50F-F8EA-4884-83B6-06F7C7768774"}
 */
function annullaStampaSituazioneRichieste(event) 
{
	globals.ma_utl_setStatus(globals.Status.BROWSE,controller.getName());
	globals.svy_mod_closeForm(event);
}

/**
 * @properties={typeid:24,uuid:"A188E29A-17B7-44A1-BF21-9A7266501B38"}
 */
function verificaStampaSituazioneRichieste()
{
	if(vAllaData == null || vDallaData == null || vAllaData < vDallaData)
		return false;
	else
		return true;
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"BCF8663F-846B-425F-981B-B30FA7A86502"}
 * @AllowToRunInFind
 */
function confermaStampaSituazioneRichieste(event) 
{
	/** @type {JSFoundSet<db:/ma_anagrafiche/lavoratori>} */
	var fsDipendenti = databaseManager.getFoundSet(globals.Server.MA_ANAGRAFICHE,globals.Table.LAVORATORI);
	if(fsDipendenti.find())
	{
		fsDipendenti.assunzione = '<=' + utils.dateFormat(vAllaData,globals.ISO_DATEFORMAT) + '|yyyyMMdd';		
		fsDipendenti.cessazione = '^||>=' + utils.dateFormat(vDallaData,globals.ISO_DATEFORMAT) + '|yyyyMMdd';
		if(vChkSoloDitta && vIdDitta)
			fsDipendenti.idditta = vIdDitta;
		
		if(fsDipendenti.search())
		{
			var arrDipendenti = globals.foundsetToArray(fsDipendenti,'idlavoratore');

			if(arrDipendenti.length > 0)
			{
				if(verificaStampaSituazioneRichieste())
				{
					var params = {
				        processFunction: process_stampa_situazione_richieste,
				        message: '', 
				        opacity: 0.5,
				        paneColor: '#434343',
				        textColor: '#EC1C24',
				        showCancelButton: false,
				        cancelButtonText: '',
				        dialogName : 'This is the dialog',
				        fontType: 'Arial,4,35',
				        processArgs: [event,arrDipendenti]
				    };
					plugins.busy.block(params);
								
				}
				else
				{
					globals.ma_utl_showWarningDialog('Controllare i valori delle date inserite e riprovare','Stampa situazione richieste');
					return;
				}
			}
		}
	}
	
}

/**
 * @param {JSEvent} event
 * @param {Array<Number>} arrDipendenti
 *
 * @properties={typeid:24,uuid:"D662CFD0-5A64-4D60-89CD-BF240428EFE5"}
 */
function process_stampa_situazione_richieste(event,arrDipendenti)
{
	try
	{
		plugins.busy.unblock();
		globals.svy_mod_closeForm(event);
		scopes.rp_reports.stampaSituazioneRichieste(arrDipendenti,vDallaData,vAllaData,vChkSoloDitta && vIdDitta ? vIdDitta : null);
	}
	catch(ex)
	{
		var msg = 'Metodo process_stampa_situazione_richieste : ' + ex.message;
		globals.ma_utl_showErrorDialog(msg)
		globals.ma_utl_logError(msg,LOGGINGLEVEL.ERROR);
	}
	finally
	{
		
	}
}

/**
 * TODO generated, please specify type and doc for the params
 * @param {JSRecord<db:/ma_anagrafiche/ditte>} rec
 *
 * @properties={typeid:24,uuid:"FA08D450-41A6-4CED-9785-D89BA6E7418B"}
 */
function AggiornaDittaRP(rec)
{
	codiceDitta = rec.codice;
	ragioneSocialeDitta = rec.ragionesociale;
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
 * @properties={typeid:24,uuid:"C51B63E0-FFCC-4D21-A1B6-06B364A912EB"}
 */
function onDataChangeSoloDitta(oldValue, newValue, event) {
	
	elements.btn_ditta.enabled = 
		elements.fld_codice.enabled = 
			elements.fld_descrizione.enabled = newValue;
	return true
}

/**
 * Callback method for when form is shown.
 *
 * @param {Boolean} firstShow form is shown first time after load
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"6350799E-64A2-46A1-B64D-8A9B14FC0648"}
 */
function onShow(firstShow, event)
{
	plugins.busy.prepare();
	globals.ma_utl_setStatus(globals.Status.EDIT,controller.getName());
}

/**
 * Handle hide window.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @returns {Boolean}
 *
 * @private
 *
 * @properties={typeid:24,uuid:"1E7B26B9-D2B0-44D3-8C5B-8D87A3A32321"}
 */
function onHide(event) 
{
	globals.ma_utl_setStatus(globals.Status.BROWSE,controller.getName());
    return true;   
}
