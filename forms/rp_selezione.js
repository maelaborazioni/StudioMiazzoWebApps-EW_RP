
/** *
 * @param oldValue
 * @param newValue
 * @param event
 *
 * @properties={typeid:24,uuid:"3DE1FE07-096F-46A6-A0E4-6996EC951EDA"}
 */
function onDataChangeDitta(oldValue, newValue, event) {
	
    _ragionesociale = ''
		
	var _foundset = databaseManager.getFoundSet(globals.nav.program['LEAF_Lkp_Ditte'].server_name,
												globals.nav.program['LEAF_Lkp_Ditte'].table_name)
			
	_foundset.addFoundSetFilterParam('ditte_to_ditte_presenze.ore_gestioneepi2', '=', 1);
	_foundset.addFoundSetFilterParam('codice', '=', newValue)
	_foundset.loadAllRecords()
	
	if (_foundset.getSize() == 1) {
		
		//aggiorniamo la parte di selezione ditta
		_idditta = _foundset['idditta']
		_ragionesociale = _foundset['ragionesociale']
		
		//aggiorniamo la parte delle sedi di installazione
		//controlliamo di non essere in presenza di ditte interinali/esterne senza alcuna sede
		if (_foundset['ditte_to_ditte_sedi'].getSize() > 0) {

			/** @type {JSFoundset} */
			var _fsSedi = _foundset['ditte_to_ditte_sedi']['ditte_sedi_to_ditte_sedigruppiinst']['ditte_sedigruppiinst_to_e2sediinstallazione']

				// se una ditta è installata (il foundset corrispondente al gruppo di installazione
			// sarà non nullo) e con più sedi, gestisci la selezione
			if (_fsSedi != null && _fsSedi.getSize() >= 1) {
				_idgruppoinst = _fsSedi['idgruppoinst']
				_descgruppoinst = _fsSedi['descrizione']

				if (_fsSedi.getSize() > 1) {
					elements.btn_selgruppoinst.enabled = true
					elements.fld_cod_gr_inst.enabled = true
					elements.fld_gruppo_inst.enabled = true

				} else {
					elements.btn_selgruppoinst.enabled = false
					elements.fld_cod_gr_inst.enabled = false
					elements.fld_gruppo_inst.enabled = false
				}

			} else {
				
				_idgruppoinst = null
				_descgruppoinst = ''
				elements.btn_selgruppoinst.enabled = false
				elements.fld_cod_gr_inst.enabled = false
				elements.fld_gruppo_inst.enabled = false
			
			}
		}
		else {
			
			_idgruppoinst = null
			_descgruppoinst = ''
			elements.btn_selgruppoinst.enabled = false
			elements.fld_cod_gr_inst.enabled = false
			elements.fld_gruppo_inst.enabled = false
		
		}
    		
		/** @type {JSFoundset} */
		var _fsGruppi = _foundset['ditte_to_ditte_presenzegruppigestione']

		if (_fsGruppi.getSize() > 1) {
			elements.btn_selgruppolav.enabled = true
			elements.fld_cod_gr_lav.enabled = true
			elements.fld_cod_gr_lav.editable = true

		} else {
			elements.btn_selgruppolav.enabled = false
			elements.fld_cod_gr_lav.enabled = false
			elements.fld_cod_gr_lav.editable = false
		}

		_codgrlav = ''
		_descgrlav = ''
//		}		
	}
	else
	{
		globals.svy_nav_showLookupWindow(event, '_idditta', 'LEAF_Lkp_Ditte', 'AggiornaSelezioneDitta', 'filterDitta', null, null, '', true)
	}	
		
	return true;
}
