/**
 * Aggiorna la visualizzazione in seguito al click del tasto di refresh
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"1C750FA8-B2E8-4422-8236-23B60776815A"}
 */
function onActionRefresh(event) 
{
	if(validaDate() && validaParametri())
	{
	   var tabIndex = globals.nav.program['RP_ElencoRichieste'].tab.selected;
	   var daEvadere = tabIndex == 1 ? true : false;
	   var params = {
	        processFunction: process_refresh_elenco,
	        message: '', 
	        opacity: 0.2,
	        paneColor: '#434343',
	        textColor: '#EC1C24',
	        showCancelButton: false,
	        cancelButtonText: '',
	        dialogName : '',
	        fontType: 'Arial,4,35',
	        processArgs: [event,daEvadere]
	    };
		plugins.busy.block(params);
	}
}

/**
 * @param {JSEvent} event
 * @param {Boolean} daEvadere
 *
 * @properties={typeid:24,uuid:"E5EE4F01-BBBB-40D8-ADEC-D4E8E662CF59"}
 */
function process_refresh_elenco(event,daEvadere)
{
	try
	{
		globals.refreshElenco(event,daEvadere);
		goToBrowseVisualizzaSituazione(event);
	}
	catch(ex)
	{
		var msg = 'Metodo process_refresh_elenco : ' + ex.message;
		globals.ma_utl_showErrorDialog(msg)
		globals.ma_utl_logError(msg,LOGGINGLEVEL.ERROR);
	}
	finally
	{
		plugins.busy.unblock();
	}
}

/**
 * @return {Boolean}
 * 
 * @properties={typeid:24,uuid:"E695ACBC-273F-4FF7-9F1C-A736C7411295"}
 */
function validaDate()
{
	if (vDal && vAl)
	{
		if(vDal > vAl)
		{
			globals.ma_utl_showWarningDialog('La data di inizio visualizzazione non può superare la data di fine','Visualizzazione copertura');
			return false;
		}
		else
			return true;
	}
	else		
		globals.ma_utl_showWarningDialog('Inserire le date di inizio e fine visualizzazione','Visualizzazione copertura');
		
	return false;
}
/**
 *
 * @param _firstShow
 * @param _event
 *
 * @properties={typeid:24,uuid:"6D63240B-A0F4-4A1E-88F1-EA5663676C10"}
 */
function onShowForm(_firstShow, _event)
{
	_super.onShowForm(_firstShow, _event);
	
	if(globals.ma_utl_hasKey(globals.Key.RICHIESTA_PERMESSI_CR))
	{
		elements.lbl_dipendente.visible =
			elements.chk_dipendente.visible = 
				elements.fld_dipendente.visible = 
					elements.btn_lkp_dipendente.visible = true;
		
		elements.lbl_dipendente.setLocation(elements.lbl_dipendente.getLocationX(),20);
		elements.chk_dipendente.setLocation(elements.chk_dipendente.getLocationX(),20);
		elements.fld_dipendente.setLocation(elements.fld_dipendente.getLocationX(),20);
		elements.btn_lkp_dipendente.setLocation(elements.btn_lkp_dipendente.getLocationX(),20);				
	}
	
	if(globals.ma_utl_hasKey(globals.Key.AUT_GESTORE))
	{
		elements.lbl_dipendente.setLocation(elements.lbl_dipendente.getLocationX(),34);
		elements.chk_dipendente.setLocation(elements.chk_dipendente.getLocationX(),34);
		elements.fld_dipendente.setLocation(elements.fld_dipendente.getLocationX(),34);
		elements.btn_lkp_dipendente.setLocation(elements.btn_lkp_dipendente.getLocationX(),34);
	}
}
