/**
 * @properties={type:8,typeid:36,uuid:"5DE1E5D5-211F-4CB7-B335-0F0CD2156ADE"}
 */
function confermata()
{
	if (stato == 1)
		return 1;
	else
		return 0;
}

/**
 * @properties={type:12,typeid:36,uuid:"0EB379A4-3BE5-436C-B1E7-73DEE971C6C0"}
 */
function status_icon()
{
	var mediaCalc;
	
	switch (stato)
	{
		case null:
		mediaCalc = "media:///pausa_16_2.png";
	    break;
		case 1:
		mediaCalc = "media:///appr.png";
	    break;
		case 2:
		mediaCalc = "media:///resp.png";
		break;
		case 3:
		mediaCalc = "media:///prec.png";
		break;
		default:
		mediaCalc = "media:///pausa_16_2.png";
		break;
	}
	
	return mediaCalc;
}

/**
 * @properties={type:93,typeid:36,uuid:"8581B903-8576-4ADD-BB82-DBF646B07BC4"}
 * @AllowToRunInFind
 */
function giorno_al()
{
	if(!lavoratori_giustificativitesta_to_lavoratori_giustificativitesta.getSelectedRecord().isEditing())
	{
		var fs = lavoratori_giustificativitesta_to_lavoratori_giustificativirighe;
		if(fs && fs.getSize() > 1)
		   fs.sort('giorno desc');
		return fs.giorno;
		
	}
	
//	if(fs.find())
//	{
//		fs.idlavoratoregiustificativotesta = idlavoratoregiustificativotesta;
//		if(fs.search())
//		{
//			fs.sort('giorno desc');
//			return fs.giorno;
//		}
//	}
	return null;
}

/**
 * @properties={type:93,typeid:36,uuid:"7A19390D-248F-4387-987A-99B998F0765C"}
 * @AllowToRunInFind
 */
function giorno_dal()
{
	if(!lavoratori_giustificativitesta_to_lavoratori_giustificativitesta.getSelectedRecord().isEditing())
	{
	    var fs = lavoratori_giustificativitesta_to_lavoratori_giustificativirighe;
	    if(fs && fs.getSize() > 1)
	       fs.sort('giorno asc');
	    return fs.giorno;
	    	    	
	}
    //	if(fs.find())
//	{
//		fs.idlavoratoregiustificativotesta = idlavoratoregiustificativotesta;
//		if(fs.search())
//		{
//			fs.sort('giorno asc');
//			return fs.giorno;
//		}
//	}
	return null;
}

/**
 * @AllowToRunInFind
 *
 * @properties={type:8,typeid:36,uuid:"FD46673C-7597-4076-B151-DF538996EEC3"}
 */
function giorno_intero()
{
	if(!lavoratori_giustificativitesta_to_lavoratori_giustificativitesta.getSelectedRecord().isEditing())
	{
		var fs = lavoratori_giustificativitesta_to_lavoratori_giustificativirighe;
		if(fs && fs.giornointero)
			return 1;
	}
//	if(fs.find())
//	{
//		fs.idlavoratoregiustificativotesta = idlavoratoregiustificativotesta;
//		if(fs.search() == 1 && fs.giornointero == 1)
//		   return 1;
//	}
	
	return 0;
}

/**
 * @AllowToRunInFind
 *
 * @properties={type:12,typeid:36,uuid:"D2ACF22D-CBEE-4728-B693-DC486B0F8FC9"}
 */
function dalle_ore()
{
	if(!lavoratori_giustificativitesta_to_lavoratori_giustificativitesta.getSelectedRecord().isEditing())
	{
	    var fs = lavoratori_giustificativitesta_to_lavoratori_giustificativirighe;
		if(fs)
		{
			if(!fs.giornointero)
			{
				var ore = fs.dalleore.getHours();
				   var min = fs.dalleore.getMinutes();
			
				   return (ore >= 10 ? ore : '0' + ore) + ':' + (min >= 10 ? min : '0' + min); 
			}
		}
	}
//	if(fs.find())
//	{
//		fs.idlavoratoregiustificativotesta = idlavoratoregiustificativotesta;
//		if(fs.search() == 1 && fs.giornointero == 0)
//		{
//		   var ore = fs.dalleore.getHours();
//		   var min = fs.dalleore.getMinutes();
//	
//		   return (ore >= 10 ? ore : '0' + ore) + ':' + (min >= 10 ? min : '0' + min); 
//		}
//	}
	return '';
}

/**
 * @properties={type:12,typeid:36,uuid:"1A3CFD43-62E3-4C8A-AFED-225A75C3D8F0"}
 * @AllowToRunInFind
 */
function alle_ore()
{
	if(!lavoratori_giustificativitesta_to_lavoratori_giustificativitesta.getSelectedRecord().isEditing())
	{
	    var fs = lavoratori_giustificativitesta_to_lavoratori_giustificativirighe;
		if(fs)
		{
			if(!fs.giornointero)
			{
				var ore = fs.alleore.getHours();
				   var min = fs.alleore.getMinutes();
			
				   return (ore >= 10 ? ore : '0' + ore) + ':' + (min >= 10 ? min : '0' + min);
			}
		}
	}
    
//	if(fs.find())
//	{
//		fs.idlavoratoregiustificativotesta = idlavoratoregiustificativotesta;
//		if(fs.search() == 1 && fs.giornointero == 0)
//		{
//		   var ore = fs.alleore.getHours();
//		   var min = fs.alleore.getMinutes();
//	
//		   return (ore >= 10 ? ore : '0' + ore) + ':' + (min >= 10 ? min : '0' + min); 
//		}
//	}
	return '';
}

/**
 * @properties={type:8,typeid:36,uuid:"17BD02B7-D871-40DF-A34F-7CE5A0E2EDFD"}
 */
function codice()
{
	return lavoratori_giustificativitesta_to_lavoratori.codice;
}

/**
 * @properties={type:12,typeid:36,uuid:"E85A04C5-6719-49B8-B735-79B83D059C7B"}
 */
function nominativo()
{
	return lavoratori_giustificativitesta_to_lavoratori.lavoratori_to_persone.nominativo;
}
