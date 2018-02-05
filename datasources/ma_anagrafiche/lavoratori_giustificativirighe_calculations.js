/**
 * @properties={type:12,typeid:36,uuid:"98AAA92B-BB0F-4BAC-89CD-6A06768460CD"}
 */
function font()
{
	if(giornointero)
	   return 'Arial,bold,12';
	else
		return 'Arial,normal,12';
}

/**
 * @properties={type:12,typeid:36,uuid:"7A2B90FB-57B7-402E-A85E-ACA2A0F395DB"}
 */
function codevento()
{
	if(giornointero)
	   return lavoratori_giustificativirighe_to_e2eventi.evento;
	else 
		return '(' + lavoratori_giustificativirighe_to_e2eventi.evento + ')';
}

/**
 * @properties={type:12,typeid:36,uuid:"5DC123E8-922C-42F3-8E19-9CD5CC866CBF"}
 */
function tooltip()
{
	var descriz = lavoratori_giustificativirighe_to_e2eventi.descriz; 
	return giornointero ? descriz : descriz + ' h. ' + ore;
}

/**
 * @properties={type:12,typeid:36,uuid:"C27CB0E2-A5B2-4557-AE22-B1D9C3FA413A"}
 */
function ore_effettive()
{
	/**@type {Number}	 */
	var _oreEffettive = ore/100
	
	return _oreEffettive.toFixed(2);
}

/**
 * @properties={type:12,typeid:36,uuid:"2B9A4633-FFBD-4E67-B699-B469776757C1"}
 */
function descrizione()
{
	var vistaOre;
	var tipoEvento = lavoratori_giustificativirighe_to_e2eventi.evento;
	
    if (null === tipoEvento)
    {
    	vistaOre = null;
    }
    else
    {
    	if('9' === tipoEvento)
    		tipoEvento = 'L.D.';
    	if(giornointero)
    	{
    		var fascia = globals.getFasciaAssegnataGiorno(idlavoratore,giorno) 
                         || globals.getFasciaProgrammataGiorno(idlavoratore,giorno)
			             || globals.getFasciaTeoricaGiorno(idlavoratore,giorno);
    		vistaOre = tipoEvento + ' ' + ((fascia.totaleorefascia / 100).toFixed(2));
    	}
    	else
    		vistaOre = tipoEvento + ' ' + (ore.toFixed(2));
    }

    return vistaOre;
}
