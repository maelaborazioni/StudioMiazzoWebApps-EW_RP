/**
 * @type {Date}
 * 
 * @properties={typeid:35,uuid:"6949248A-3215-4636-9608-07377D26D1F0",variableType:93}
 */
var vDal = null;
/**
 * @type {Date}
 * 
 * @properties={typeid:35,uuid:"DDD25686-320F-4BC6-A8EE-C1101F32A818",variableType:93}
 */
var vAl = null;

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"F891AC5C-F805-4239-ABD2-2A0C2AA2BA9A"}
 */
function confermaModificaRichiesta(event) {
	
//	//gestione dell'inserimento della richiesta nel database
//	var frmName = 'rp_richiesta_permessi_edit_tbl';
//	var frm = forms[frmName];
//	var fs = frm.foundset;
//	var rec = fs.getSelectedRecord();
//	
//	// TODO validazione richiesta modificata
//	
//	databaseManager.startTransaction();
//	
//	// record lavoratori_giustificativotesta
//	var recTesta = foundset.getSelectedRecord();
//	
//	// è modificabile solamente una richiesta per giorno singolo 
//	var recRiga = recTesta.lavoratori_giustificativitesta_to_lavoratori_giustificativirighe;
//	
//	// ottenimento informazioni sulla fascia per verifica orari inseriti
//	var objInfoFascia = globals.ottieniInformazioniFasciaGiorno(recTesta.idlavoratore, recRiga.giorno);
//	
//	// aggiornamento dell'orario modificato
//	if(!rec['intero'])
//	{
//		var _dalleOre = rec['dalleore'].getHours() * 100 + rec['dalleore'].getMinutes();
//		var _alleOre = rec['alleore'].getHours() * 100 + rec['alleore'].getMinutes();
//		// gestione fasce con orario notturno
//		if (objInfoFascia['fineorario'] < objInfoFascia['inizioorario']) {
//			if (_dalleOre < objInfoFascia['fineorario'])
//				_dalleOre += 2400;
//			objInfoFascia['fineorario'] += 2400;
//			_alleOre += 2400;
//		}
//
//		// gestione del calcolo delle ore a seconda del parametro impostato
//		switch (globals.getParameterValue(globals.getDitta(recTesta.idlavoratore), 'MCO')) {
//		case 'SF': // di default si effettuano i controlli sulla fascia associate al giorno
//		default:
//			rec['oreevento'] = globals.calcolaOreEvento(_dalleOre,
//				_alleOre,
//				objInfoFascia['inizioorario'],
//				objInfoFascia['iniziopausa'],
//				objInfoFascia['finepausa'],
//				objInfoFascia['fineorario'],
//				objInfoFascia['totaleorefascia'],
//				objInfoFascia['totaleorepausa']);
//			break;
//		case 'D': // altrimenti il calcolo è diretto
//			rec['oreevento'] = globals.calcolaOreEventoDiretto(_dalleOre, _alleOre);
//			break;
//		
//		}
//	}
//	
//	recRiga.ore = rec['oreevento'];
//		
//	if(!databaseManager.commitTransaction())
//	{
//		databaseManager.rollbackTransaction();
//		globals.ma_utl_showInfoDialog('Errore durante il salvataggio dei dati, riprovare','Inserimento nuova richiesta');
//	    return;
//	}
//	
//	globals.ma_utl_setStatus(globals.Status.BROWSE,controller.getName());
//    globals.svy_mod_closeForm(event);
//    if(solutionModel.getForm(forms.rp_elenco_richieste_situazione.controller.getName()))
//    	globals.refreshElenco(event,true);
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"D7B1ACFE-4B2D-4E2A-9828-35166C738A03"}
 */
function annullaModificaRichiesta(event) 
{
	//gestione del rollback
	databaseManager.rollbackTransaction();
	
    globals.ma_utl_setStatus(globals.Status.BROWSE,controller.getName());
    globals.svy_mod_closeForm(event);
    
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
 * @properties={typeid:24,uuid:"512B4B67-CF3D-453F-9702-1D8F6104F893"}
 */
function onHide(event) 
{
	annullaModificaRichiesta(event);
	return _super.onHide(event);
}
