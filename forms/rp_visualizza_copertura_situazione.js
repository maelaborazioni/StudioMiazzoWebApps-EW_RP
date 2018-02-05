
/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"D750F3C5-EB5A-4895-8018-5844A6617B4F"}
 */
function onActionRefresh(event) 
{
	if(validaDate() && validaParametri())
	{
		var params = {
	        processFunction: process_refresh,
	        message: '', 
	        opacity: 0.5,
	        paneColor: '#434343',
	        textColor: '#EC1C24',
	        showCancelButton: false,
	        cancelButtonText: '',
	        dialogName : 'This is the dialog',
	        fontType: 'Arial,4,35',
	        processArgs: [event]
	    };
		plugins.busy.block(params);
	}	
}

/**
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"3314DFDF-D20C-4D25-A386-6EDBFCFD6D85"}
 */
function process_refresh(event)
{
	try
	{
	   setLastSelection(event);	
	   switch(vTipoVisualizzazione)
	   {
		   case 1:
		       forms.giorn_visualizza_copertura.refreshCoperturaAssenze(event);
		       break;
		   case 2:
			   forms.giorn_visualizza_copertura.refreshCoperturaTurni(event);  
			   break;
		   case 3:
			   forms.giorn_visualizza_copertura.refreshCoperturaGiornaliera(event);
			   break;
		   case 4:
			   forms.giorn_visualizza_copertura.refreshCoperturaCommesse(event);
			   break;
		   default:
			   break;
	   }
	   
	   goToBrowseVisualizzaSituazione(event);
	}
	catch(ex)
	{
		var msg = 'Metodo process_refresh : ' + ex.message;
		globals.ma_utl_showErrorDialog(msg)
		globals.ma_utl_logError(msg,LOGGINGLEVEL.ERROR);
	}
	finally
	{
		plugins.busy.unblock();
	}
}
