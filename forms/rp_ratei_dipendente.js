/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"3EA1C435-7E9F-42C1-B828-B592F42C8ECC"}
 */
function refreshRateiDipendenti(event) {

	gestisciTabRateiTbl(controller.getName(),
		                elements.tabSitRatei.getName(),
						'rp_ratei_dipendente',
		                dataSituazioneAlGiorno,
						foundset.idlavoratore);
}



/** *
 * @param _firstShow
 * @param _event
 *
 * @properties={typeid:24,uuid:"DCEEEAD3-A719-4FEC-9CA5-4BDB063280C0"}
 */
function onShowForm(_firstShow, _event) {
	
//	_super.onShowForm(_firstShow, _event);
	gestisciTabRateiTbl(controller.getName(),
		                elements.tabSitRatei.getName(),
						'rp_ratei_dipendente',
                        dataSituazioneAlGiorno,
						foundset.idlavoratore);
}

/** *
 * @param _event
 * @param _form
 *
 * @properties={typeid:24,uuid:"79D78705-D84C-4EF5-A350-95201BFFE385"}
 */
function onRecordSelection(_event, _form) {
	
    //_super.onRecordSelection(_event, _form)
	gestisciTabRateiTbl(controller.getName(),
                        elements.tabSitRatei.getName(),
		                'rp_ratei_dipendente',
                        dataSituazioneAlGiorno,
		                foundset.idlavoratore);
}
