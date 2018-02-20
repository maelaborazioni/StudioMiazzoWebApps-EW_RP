/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"B5FDF8A8-D317-49BF-883F-508EE0BBA6AC",variableType:4}
 */
var currDip = -1;

/**
 * @type {Number}
 * 
 * @properties={typeid:35,uuid:"E8ECBCF3-CE5C-4FAE-9918-5186050B67AB",variableType:8}
 */
var DA_EVADERE = null;

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"38EA5E4E-8C5F-4B50-8458-BC89B3B1B2D5",variableType:4}
 */
var CONFERMATO = 1;
/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"37E3CD57-0DCE-4609-9077-3094380542BF",variableType:4}
 */
var	RIFIUTATO = 2;

/**
 * @type {Array}
 * 
 * @properties={typeid:35,uuid:"E5A39ABF-FC97-4DC8-BC3D-6361CB7B0A70",variableType:-4}
 */
var arrClientiRPGestitiDaStudio = [];//['Cliente_006030'];

/**
 * @properties={typeid:24,uuid:"D9423023-9667-44B9-BA29-A0AD300C7EF8"}
 * @AllowToRunInFind
 */
function selezione_GR()
{
	if(globals._tipoConnessione == 0 || _to_sec_organization$lgn.sec_organization_to_sec_owner.name == 'M.A.Elaborazioni')
	{
		globals.ma_utl_showInfoDialog('Funzionalità attiva solo in modalità cliente','Gestione richieste permessi');
		return;
	}
	
	var userName = security.getUserName();
	if(!_to_sec_user$user_id.sec_user_to_sec_user_to_lavoratori)
	{
		application.output('Utente ' + security.getUserName(), LOGGINGLEVEL.ERROR);
		return;
	}
	
	var userEwId = _to_sec_user$user_id.sec_user_to_sec_user_to_lavoratori.idlavoratore;
	
	if(userName == 'DEMO')
	{
		currDitta = globals.svy_nav_showLookupWindow(new JSEvent, "currDitta", globals.lkpDITTA,
                                                     null, 'FiltraLavoratoriDittaStandard', null, null, '', true);

        currDip = globals.svy_nav_showLookupWindow(new JSEvent,"currDip",globals.lkpLAVORATORI,
                                                   'ApriGR','FiltraLavoratoriReparto',null,null,null,true);	
	}
	else if(userEwId)
	{
		currDip = userEwId;
		currDitta = globals.getDitta(currDip);
		ApriGR();
		
	}
	else
		globals.ma_utl_showErrorDialog('Utente non trovato','Gestione richieste');
	
}

/**
 * @properties={typeid:24,uuid:"6F62B265-BAF8-468D-8560-59FC8B89837A"}
 */
function selezione_SR()
{
	if(globals._tipoConnessione == 0 || _to_sec_organization$lgn.sec_organization_to_sec_owner.name == 'M.A.Elaborazioni')
	{
		globals.ma_utl_showInfoDialog('Funzionalità attiva solo in modalità cliente','Situazione ratei');
		return;
	}
	
	var userName = security.getUserName();
	var userEwId = _to_sec_user$user_id.sec_user_to_sec_user_to_lavoratori.idlavoratore;
	
	if(userName == 'DEMO')
	{
		currDitta = globals.svy_nav_showLookupWindow(new JSEvent, "currDitta", globals.lkpDITTA,
                                                     null, 'FiltraLavoratoriDittaStandard', null, null, '', true);

        currDip = globals.svy_nav_showLookupWindow(new JSEvent,"currDip",globals.lkpLAVORATORI,
                                                   'ApriSR','FiltraLavoratoriReparto',null,null,null,true);	
	}
	else if(userEwId)
	{
		currDip = userEwId;
		currDitta = globals.getDitta(currDip);
		ApriSR();
		
	}
	else
		globals.ma_utl_showErrorDialog('Utente non trovato','Gestione richieste');
}

/**
 * @properties={typeid:24,uuid:"6B3A9C92-3299-4C1A-9B23-4423BE002F6B"}
 */
function selezione_PRic()
{	
	if(globals._tipoConnessione == 0 || _to_sec_organization$lgn.sec_organization_to_sec_owner.name == 'M.A.Elaborazioni')
	{
		globals.ma_utl_showInfoDialog('Funzionalità attiva solo in modalità cliente','Pannello richieste');
		return;
	}
	
	var recSingolaDitta = globals.getSingolaDitta(globals.Tipologia.STANDARD);
	if(recSingolaDitta)
		ApriPRic(recSingolaDitta);
	else if (globals._filtroSuDitta != null) {

		currDitta = globals._filtroSuDitta;
		
		ApriPRic(null);
		
	} else {

		currDitta = -1;

		globals.svy_nav_showLookupWindow(new JSEvent, "currDitta", globals.lkpDITTA,
			                             'ApriPRic', 'FiltraLavoratoriDittaStandard', null, null, '', true);
	
	}
}

/**
 * @properties={typeid:24,uuid:"66A03946-479B-473A-839A-1DACBA1FB5B6"}
 */
function selezione_VC()
{	
	if(globals._tipoConnessione == 0 || _to_sec_organization$lgn.sec_organization_to_sec_owner.name == 'M.A.Elaborazioni')
	{
		globals.ma_utl_showInfoDialog('Funzionalità attiva solo in modalità utente','Visualizzazione copertura');
		return;
	}
	
	ApriVC(null);
	// in presenza di gerarchia non si richiede la ditta ma tutto dipende da come sono stati gestiti i gruppi
//	if (globals.ma_utl_hasKey(globals.Key.AUT_GERARCHIA)) {
//       ApriVC(null);
//	} else {
//		var recSingolaDitta = globals.getSingolaDitta();
//		if (recSingolaDitta)
//			ApriVC(recSingolaDitta);
//		else if (globals._filtroSuDitta != null) {
//
//			currDitta = globals._filtroSuDitta;
//
//			ApriVC(null);
//
//		} else {
//
//			currDitta = globals.svy_nav_showLookupWindow(new JSEvent, "currDitta", globals.lkpDITTA,
//				                                         '', 'FiltraLavoratoriDittaStandard', null, null, '', true);
//			ApriVC(null);
//		}
//	}
}

/**
 * @properties={typeid:24,uuid:"8A89D333-9B91-4F3D-B5CD-B2CD1B4B4DDD"}
 */
function selezione_VC_RP()
{
	if(globals._tipoConnessione == 0 || _to_sec_organization$lgn.sec_organization_to_sec_owner.name == 'M.A.Elaborazioni')
	{
		globals.ma_utl_showInfoDialog('Funzionalità attiva solo in modalità utente','Visualizzazione copertura');
		return;
	}
	
	ApriVC_RP(null);
}

/**
 * @properties={typeid:24,uuid:"71C53C65-2E8F-4F08-91D5-1C3021667EEF"}
 */
function selezione_VC_PT()
{
	if(globals._tipoConnessione == 0 || _to_sec_organization$lgn.sec_organization_to_sec_owner.name == 'M.A.Elaborazioni')
	{
		globals.ma_utl_showInfoDialog('Funzionalità attiva solo in modalità utente','Visualizzazione copertura');
		return;
	}
	
	ApriVC_PT(null);
}

/**
 * @properties={typeid:24,uuid:"CB6B07BE-AA79-4C46-83B9-134E43E6E95F"}
 */
function selezione_VC_dipendente()
{
	var userEwId = _to_sec_user$user_id.sec_user_to_sec_user_to_lavoratori.idlavoratore;
	currDitta = globals.getDitta(userEwId);
	
	ApriVC(null);
}

/**
 * @properties={typeid:24,uuid:"42600F1D-8FCE-4122-82C4-E4B7A149C8FD"}
 */
function selezione_ER()
{	
	if(globals._tipoConnessione == 0 || _to_sec_organization$lgn.sec_organization_to_sec_owner.name == 'M.A.Elaborazioni')
	{
		globals.ma_utl_showInfoDialog('Funzionalità attiva solo in modalità cliente','Elenco richieste');
		return;
	}
	
	// in presenza di gerarchia non si richiede la ditta ma tutto dipende da come sono stati gestiti i gruppi
	if (globals.ma_utl_hasKey(globals.Key.AUT_GERARCHIA)) {
       ApriER(null);
	} else {
		var recSingolaDitta = globals.getSingolaDitta(globals.Tipologia.CLIENTE);
		if (recSingolaDitta)
			ApriER(recSingolaDitta);
		else if (globals._filtroSuDitta != null) {

			currDitta = globals._filtroSuDitta;

			ApriER(null);

		} else {

			currDitta = -1;

			globals.svy_nav_showLookupWindow(new JSEvent, "currDitta", globals.lkpDITTA,
				'ApriER', 'filtraDittaControllateNonEsterna', null, null, '', true);
		}
	}
}

/**
 * @properties={typeid:24,uuid:"B7699F15-9FD8-4931-98F1-9144BCCEDA6B"}
 */
function selezione_SRR()
{	
	if(globals._tipoConnessione == 0 || _to_sec_organization$lgn.sec_organization_to_sec_owner.name == 'M.A.Elaborazioni')
	{
		globals.ma_utl_showInfoDialog('Funzionalità attiva solo in modalità cliente','Situazione ratei reparto');
		return;
	}
	
	ApriSSR(null); // non è associata alla specifica ditta ma alla gerarchia dell'organigramma
	
//	var recSingolaDitta = globals.getSingolaDitta(globals.Tipologia.STANDARD);
//	if(recSingolaDitta)
//		ApriSSR(recSingolaDitta);
//	else if (globals._filtroSuDitta != null) {
//
//		currDitta = globals._filtroSuDitta;
//		
//		ApriSSR(null);
//		
//	} else {
//
//		currDitta = -1;
//
//		globals.svy_nav_showLookupWindow(new JSEvent, "currDitta", globals.lkpDITTA,
//			                             'ApriSSR', 'filtraDittaControllateNonEsterna', null, null, '', true);
//	}
}

/**
 * @param {JSRecord} _rec
 *
 * @properties={typeid:24,uuid:"D4240EE2-8C82-471B-99AD-8B2A232343E8"}
 */
function ApriPRic(_rec)
{
	var _filter = new Object();
	_filter.filter_name = 'ftr_idditta';
	_filter.filter_field_name = 'idditta';
	_filter.filter_operator = '=';
	if(_rec)
		_filter.filter_value = _rec['idditta'];
	else 
	    _filter.filter_value = currDitta;
	    
	var _progObj = globals.nav.program['RP_PannelloRichieste'];
	_progObj.filter = [_filter];  
	_progObj.foundset = null;
	
    globals.openProgram('RP_PannelloRichieste');
	
}

/**
 * @param {JSRecord} _rec
 *
 * @properties={typeid:24,uuid:"332B9813-F95C-4578-A5B0-D83550D7D460"}
 */
function ApriVC(_rec)
{
	var _filter = new Object();
	_filter.filter_name = 'ftr_idditta';
	_filter.filter_field_name = 'idditta';
	_filter.filter_operator = '=';
	if(_rec)
		_filter.filter_value = _rec['idditta'];
	else 
	    _filter.filter_value = currDitta;
	  
	var _progName = 'LEAF_VisualizzaCopertura';     
//	var _progObj = globals.nav.program[_progName];
//	// se ha la gerarchia il filtro dipendenti va fatto su tutte le ditte del gruppo, altrimenti solo su quella selezionata
//	_progObj.filter = globals.ma_utl_hasKey(globals.Key.AUT_GERARCHIA) ? globals.getDitteStandard() : [_filter];  
//	_progObj.foundset = null;
	
	/** @type {{idditta:Number, datasource:String, numgiorni:Number, numdip:Number, dal:Date, al:Date}} */
	var _progParams = {};
	_progParams.idditta = -1;//_rec ? _rec['idditta'] : currDitta;
	_progParams.datasource = null;
	_progParams.numgiorni = null;
	_progParams.numdip = null;
	_progParams.dal = null;
	_progParams.al = null;
	
    globals.openProgram(_progName,_progParams,true);
    
}

/**
 * TODO generated, please specify type and doc for the params
 * @param _rec
 *
 * @properties={typeid:24,uuid:"491AD6EE-29E9-42DB-B36E-D14D767061A7"}
 */
function ApriVC_RP(_rec)
{
	var _filter = new Object();
	_filter.filter_name = 'ftr_idditta';
	_filter.filter_field_name = 'idditta';
	_filter.filter_operator = '=';
	if(_rec)
		_filter.filter_value = _rec['idditta'];
	else 
	    _filter.filter_value = currDitta;
	  
	var _progName = 'RP_VisualizzaCopertura';     
	
	/** @type {{idditta:Number, datasource:String, numgiorni:Number, numdip:Number, dal:Date, al:Date}} */
	var _progParams = {};
	_progParams.idditta = -1;//_rec ? _rec['idditta'] : currDitta;
	_progParams.datasource = null;
	_progParams.numgiorni = null;
	_progParams.numdip = null;
	_progParams.dal = null;
	_progParams.al = null;
	
    globals.openProgram(_progName,_progParams,true);
    
}

/**
 * TODO generated, please specify type and doc for the params
 * @param _rec
 *
 * @properties={typeid:24,uuid:"03EEFED4-EC01-4423-B688-652A746F7AF3"}
 */
function ApriVC_PT(_rec)
{
	var _filter = new Object();
	_filter.filter_name = 'ftr_idditta';
	_filter.filter_field_name = 'idditta';
	_filter.filter_operator = '=';
	if(_rec)
		_filter.filter_value = _rec['idditta'];
	else 
	    _filter.filter_value = currDitta;
	  
	var _progName = 'PT_VisualizzaCopertura';     
	
	/** @type {{idditta:Number, datasource:String, numgiorni:Number, numdip:Number, dal:Date, al:Date}} */
	var _progParams = {};
	_progParams.idditta = -1;//_rec ? _rec['idditta'] : currDitta;
	_progParams.datasource = null;
	_progParams.numgiorni = null;
	_progParams.numdip = null;
	_progParams.dal = null;
	_progParams.al = null;
	
    globals.openProgram(_progName,_progParams,true);
    
}

/**
 * @param {JSRecord} _rec
 *
 * @properties={typeid:24,uuid:"2F07D99F-ED85-4D22-A3BE-65625DB70CFA"}
 * @AllowToRunInFind
 */
function ApriER(_rec)
{

	if(!globals.ma_utl_hasKey(globals.Key.AUT_GESTORE))
	{
		var _filter = new Object();
		_filter.filter_name = 'ftr_idlavoratore';
		_filter.filter_field_name = 'idlavoratore';
		_filter.filter_operator = 'IN';
		
		/** @type {JSFoundset<db:/ma_anagrafiche/lavoratori>}*/
		var fs = databaseManager.getFoundSet(globals.Server.MA_ANAGRAFICHE,globals.Table.LAVORATORI);
	    
		if(_rec != null)
		{
		   if(fs.find())
	 	   {
			  fs.idditta = _rec['idditta'];
			  if(fs.search())
				  _filter.filter_value = globals.foundsetToArray(fs,'idlavoratore');
		   }
		}
		else
		    _filter.filter_value = globals.sec.lavoratori;
		    
		var _progObj = globals.nav.program['RP_ElencoRichieste'];
		_progObj.filter = [_filter];  
		_progObj.foundset = null;
	}
	
    globals.openProgram('RP_ElencoRichieste');
	
}

/**
 * @param {JSRecord} _rec
 *
 * @properties={typeid:24,uuid:"8C2267CD-FC42-4C2D-90BA-9E0ABEED1D5F"}
 */
function ApriSSR(_rec)
{
	var _filter = new Object();
//	_filter.filter_name = 'ftr_idditta';
//	_filter.filter_field_name = 'idditta';
//	_filter.filter_operator = '=';
//	if(_rec)
//		_filter.filter_value = _rec['idditta'];
//	else 
//	    _filter.filter_value = currDitta;
	    
	var _progObj = globals.nav.program['RP_Ratei_Reparto'];
	_progObj.filter = [_filter];  
	_progObj.foundset = null;
	
    globals.openProgram('RP_Ratei_Reparto');
	
}

/**
 * @param {JSRecord} [_rec]
 *
 * @properties={typeid:24,uuid:"3139E9BA-D756-4983-871D-6FBB4E5796A1"}
 */
function ApriGR(_rec)
{
	var idLavoratore = _rec ? _rec['idlavoratore'] : currDip;
	
	var _filter = new Object();
	
	_filter.filter_name = 'ftr_lavoratore';
	_filter.filter_field_name = 'idlavoratore';
	_filter.filter_operator = '=';
	_filter.filter_value = idLavoratore;
	
	var _progObj = globals.nav.program['RP_GestioneRichieste'];
	_progObj.filter = [_filter];  
	_progObj.foundset = null;
	
	globals.openProgram('RP_GestioneRichieste',null,true);
    	
}

/**
 * @param {JSRecord} [_rec]
 *
 * @properties={typeid:24,uuid:"38E0F226-BEA7-4CB3-ADB4-38D4127A35C0"}
 */
function ApriSR(_rec)
{
	var _filter = new Object();
	_filter.filter_name = 'ftr_iddip';
	_filter.filter_field_name = 'idlavoratore';
	_filter.filter_operator = '=';
	if(_rec)
		_filter.filter_value = _rec['idlavoratore'];
	else 
	    _filter.filter_value = currDip;
	    
	var _progObj = globals.nav.program['RP_Ratei_Dipendente'];
	_progObj.filter = [_filter];  
	_progObj.foundset = null;
	
    globals.openProgram('RP_Ratei_Dipendente',null,true);
    
}

/**
 * @param {JSFoundset} _fs
 *
 * @properties={typeid:24,uuid:"A121B27E-E188-4683-A255-92919C132E37"}
 */
function FiltraLavoratoriReparto(_fs)
{
	_fs.addFoundSetFilterParam('idditta','=',currDitta);
	return _fs;
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 * @param {Boolean} daEvadere
 * @param {String} [order]
 * 
 * @properties={typeid:24,uuid:"DB471A2D-2B1F-4B3F-A3C1-F3011309E136"}
 * @AllowToRunInFind
 */
function refreshElenco(event,daEvadere,order)
{
	if(validaParameters())
	{
		forms.rp_elenco_richieste_situazione.goToBrowseVisualizzaSituazione(event);
		
		var frmFtr = forms.rp_elenco_richieste;
		var frmSit = forms.rp_elenco_richieste_situazione;
		var fs = frmFtr.foundset;
	               
       fs.find();
       
       /** @type {JSFoundset<db:/ma_anagrafiche/lavoratori>}*/
       var fsLav = databaseManager.getFoundSet(globals.Server.MA_ANAGRAFICHE,globals.Table.LAVORATORI);
   	   fsLav.loadAllRecords();
   	   var arrLav = globals.foundsetToArray(fsLav,'idlavoratore');
       
   	   fs.idlavoratore = arrLav;
   	   
       if(daEvadere)
    	   fs.stato = '^';
       else
    	   fs.stato = '!^';

       var dateDal = utils.dateFormat(frmSit.vDal,globals.ISO_DATEFORMAT);
       var dateAl = utils.dateFormat(frmSit.vAl,globals.ISO_DATEFORMAT);
       fs.lavoratori_giustificativitesta_to_lavoratori_giustificativirighe.giorno = dateDal + '...' + dateAl + '|yyyyMMdd';                                                                                                                                                                                                                          
           	   
       if(frmSit.vChkDip)
          fs.idlavoratore = frmSit.vIdDip;
       
       //  getLavoratori gruppi
       if(frmSit.vChkGruppo)
       {
    	// se indicato un gruppo considera solo i dipendenti del gruppo specificato
    		if (frmSit.vGroupId != -1 || frmSit.vArrGroupId.length > 0) 
    		{
    			if (globals.ma_utl_hasKey(globals.Key.AUT_GERARCHIA)) 
    			{
    				// recupero dell'array con tutti i lavoratori appartenenti a i gruppi scelti
    				if(frmSit.vArrGroupId.length)
    				{
    					var arrLavReparti = [];
    					for(var g = 0; g < frmSit.vArrGroupId.length; g++)
    					{
    						var arrLavReparto = globals.getLavoratoriReparto(frmSit.vArrGroupId[g]);
    						for(var r = 0; r <= arrLavReparto.length; r++)
    						{
    							if(arrLavReparti.indexOf(arrLavReparto[r]) == -1)
    								arrLavReparti.push(arrLavReparto[r]);
    						}
    					}
    					fs.idlavoratore = arrLavReparti;
    				}
    				else
    					fs.idlavoratore = globals.getLavoratoriReparto(frmSit.vGroupId);
    			}
    			else
    			{
    				/** @type {JSFoundset<db:/svy_framework/sec_user_right>}*/
    				var fsUserRight = databaseManager.getFoundSet(globals.Server.SVY_FRAMEWORK, 'sec_user_right');
    				
    				if (fsUserRight.find())
    				{
    					fsUserRight.group_id = (frmSit.vArrGroupId && frmSit.vArrGroupId.length) ? frmSit.vArrGroupId : frmSit.vGroupId;
    					fsUserRight.sec_user_right_to_sec_security_key.is_client = 1;
    					if (fsUserRight.search()) 
    					{
    						/** @type {JSFoundset<db:/ma_framework/v_sec_filtrilavoratori>} */
    						var fsSecLavoratori = databaseManager.getFoundSet(globals.Server.MA_FRAMEWORK, 'v_sec_filtrilavoratori');
    						if (fsSecLavoratori.find()) 
    						{
    							fsSecLavoratori.exclude = 0;
    							fsSecLavoratori.idchiave = globals.foundsetToArray(fsUserRight.sec_user_right_to_sec_security_key, 'security_key_id');
    							fsSecLavoratori.search();
    							fs.idlavoratore = globals.foundsetToArray(fsSecLavoratori, 'idlavoratore');
    						} 
    						else
    						{
    							globals.ma_utl_showErrorDialog('Errore nel recupero dei dati dei lavoratori associati alla chiave', 'Visualizza copertura');
    							return;
    						}
    					}
    				}
    				else 
    				{
    					globals.ma_utl_showErrorDialog('Errore nel recupero dei dati delle chiavi utenti', 'Visualizza copertura');
    					return;
    				}
    			}
    		}
    		
    		// filtro su sede di lavoro
    		if(frmSit.vChkSedeDiLavoro)
    		   fs.iddittasede = (frmSit.vArrIdSede && frmSit.vArrIdSede.length) ? frmSit.vArrIdSede : frmSit.vIdSede;
    		// filtro su centro di costo
    		if(frmSit.vChkCentroDiCosto)
    			fs.lavoratori_to_lavoratori_classificazioni.codclassificazione = (frmSit.vArrCodCentroDiCosto && frmSit.vArrCodCentroDiCosto.length) ? 
    					                                                                frmSit.vArrCodCentroDiCosto : 
    		                                                                            frmSit.vCodCentroDiCosto.toString();
       }
    	         
       if(frmSit.vChkSedeDiLavoro)
          fs.lavoratori_giustificativitesta_to_lavoratori.iddittasede = frmSit.vArrIdSede.length ? frmSit.vArrIdSede : frmSit.vIdSede;
       
       if(frmSit.vChkCentroDiCosto)
       	   fs.lavoratori_giustificativitesta_to_lavoratori.lavoratori_to_lavoratori_classificazioni.codclassificazione =
    		   frmSit.vArrCodCentroDiCosto.length ? frmSit.vArrCodCentroDiCosto : frmSit.vCodCentroDiCosto;
       
       if(frmSit.vChkSingolaDitta)
       	   fs.lavoratori_giustificativitesta_to_lavoratori.idditta = frmSit.vIdDitta;
              
       fs.search();
       var selOrder = (order ? order : ' desc');
       fs.sort('lavoratori_giustificativitesta_to_lavoratori_giustificativirighe.giorno ' + selOrder);
              
       frmSit.elements.btn_refresh.enabled = false;
       frmSit.elements.btn_annulla.enabled = true;
	}
		
}

/**
 * @properties={typeid:24,uuid:"956775CE-2F33-4D49-959E-887A1FA0AEC2"}
 */
function validaParameters()
{
	var frmFtr = forms.rp_elenco_richieste_situazione;
	
	if(frmFtr.vChkDip && !frmFtr.vIdDip)
	{
		globals.ma_utl_showWarningDialog('Selezionare un dipendente o deselezionare il filtro sul dipendente','Elenco richieste');
	    return false;
	}
	if(frmFtr.vChkSedeDiLavoro && !frmFtr.vIdSede)
	{
		globals.ma_utl_showWarningDialog('Selezionare una sede o deselezionare il filtro sulla sede di lavoro','Elenco richieste');
	    return false;
	}
	if(frmFtr.vChkCentroDiCosto && !frmFtr.vCodCentroDiCosto)
	{
		globals.ma_utl_showWarningDialog('Selezionare un centro di costo o deselezionare il filtro sul centro di costo','Elenco richieste');
	    return false;
	}
	
	if(!frmFtr.vDal && !frmFtr.vAl)
		return true;
	
	if (frmFtr.vDal && frmFtr.vAl)
	{
		if(frmFtr.vDal > frmFtr.vAl)
		{	
			globals.ma_utl_showWarningDialog('La data di inizio visualizzazione non può superare la data di fine','Elenco richieste');
	        return false;
		}
		
		return true;
	}	
	else
	{
		globals.ma_utl_showWarningDialog('Inserire le date di inizio e fine visualizzazione','Elenco richieste');
	    return false;
	}
	
}

/**
 * @param {Number} idgiustificativotesta
 * @param {Number} status
 * @param {Boolean} inviaMail
 * @param {String} [noteRisposta]
 * 
 * @properties={typeid:24,uuid:"248C9FB0-16B0-4E40-ABAA-B4D1145339A4"}
 * @AllowToRunInFind
 */
function gestisciRichiesta(idgiustificativotesta, status, inviaMail, noteRisposta)
{
	/** @type {JSFoundset<db:/ma_anagrafiche/lavoratori_giustificativitesta>}*/
	var fs = databaseManager.getFoundSet(globals.Server.MA_ANAGRAFICHE,globals.Table.RP_TESTA);
	if(fs.find())
	{
		fs.idlavoratoregiustificativotesta = idgiustificativotesta;
		if(fs.search())
		{
			databaseManager.startTransaction();
			
			/** @type {JSRecord<db:/ma_anagrafiche/lavoratori_giustificativitesta>}*/
			var rec = fs.getSelectedRecord();
	
		   // conferma la richiesta
	       if (status)
		      rec['stato'] = 1;
	       //rifiuta la richiesta
	       else
		      rec['stato'] = 2;

			rec['approvatoil'] = globals.TODAY;
			rec['approvatoda'] = _to_sec_user$user_id.user_id ? globals.getUserName(_to_sec_user$user_id.user_id) : security.getUserName();

			// nel caso di richiesta approvata, se in possesso della chiave di Programmazione negozio,
			// dobbiamo verificare che i giorni della richiesta non si sovrappongano a giorni aventi fasce già programmate
			if(status && globals.ma_utl_hasKey(globals.Key.NEGOZIO))
			{
				var fsRighePre = rec.lavoratori_giustificativitesta_to_lavoratori_giustificativirighe;
				
				for (var r = 1; r <= fsRighePre.getSize(); r++) 
				{
				    var recRigaPre = fsRighePre.getRecord(r);
				    if(globals.getFasciaProgrammataGiorno(rec.idlavoratore ,recRigaPre.giorno))
				    {
				    	databaseManager.rollbackTransaction();
				    	globals.ma_utl_showWarningDialog('Esistono delle fasce precedentemente programmate per i giorni richiesti, non è possibile confermare la richiesta','Conferma richiesta');
                        return;
				    }
				}
				
			}
			
			if (!databaseManager.commitTransaction()) 
			{
				databaseManager.rollbackTransaction();
				globals.ma_utl_showWarningDialog('Errore durante il salvataggio', 'Setta stato richiesta');
				return;
			}
			else 
			{
				if (status)
			    {
			    	var idDitta = globals.getDitta(rec.idlavoratore);
			    	if (idDitta) 
			    	{
			    		var fsRighe = rec.lavoratori_giustificativitesta_to_lavoratori_giustificativirighe;
					
						for (var i = 1; i <= fsRighe.getSize(); i++) 
						{
							var recRiga = fsRighe.getRecord(i);
							var propPredefEvento = globals.getProprietaPredefinitaEvento(recRiga.lavoratori_giustificativirighe_to_e2eventi.ideventoclasse); 
							var evParams = globals.inizializzaParametriEvento(idDitta,
								recRiga.giorno.getFullYear() * 1000 + recRiga.giorno.getMonth() + 1,
								0,
								[recRiga.giorno.getDate()],
								globals.TipoGiornaliera.BUDGET,
								globals.TipoConnessione.CLIENTE,
								[recRiga.idlavoratore],
								recRiga.idevento,
								propPredefEvento,
								recRiga.giornointero == 0 ? recRiga.ore : 0, //verificare se giorno intero o meno
								recRiga.importo,
								-1,
								'',
								recRiga.giornointero //flag copertura orario teorico
							);
							
//							// se in possesso della chiave di Programmazione Negozio, va compilata la programmazione fasce
//						   	if(globals.ma_utl_hasKey(globals.Key.NEGOZIO))
//							{								
//						    	// ottenimento informazioni sulla fascia per verifica orari inseriti
//								var objInfoFascia = globals.ottieniInformazioniFasciaGiorno(rec.idlavoratore, recRiga.giorno);
//						    	/** @type {JSFoundset<db:/ma_presenze/e2giornalieraprogfasce>} */
//								var fsFasceProg = databaseManager.getFoundSet(globals.Server.MA_PRESENZE,globals.Table.GIORNALIERA_PROGFASCE);
//								databaseManager.startTransaction();
//								
//								fsFasceProg.newRecord();
//								fsFasceProg.giorno = recRiga.giorno;
//								fsFasceProg.iddip = rec.idlavoratore;
//								fsFasceProg.idfasciaorariafittizia = null;
//								fsFasceProg.iddittafasciaorariatimbrature = null;
//								fsFasceProg.idfasciaoraria = objInfoFascia.idfascia;
//								fsFasceProg.tiporiposo = 0;
//							
//								if(!databaseManager.commitTransaction())
//								{
//									databaseManager.rollbackTransaction();
//									globals.ma_utl_showErrorDialog('Si è verificato un errore durante l\'inserimento della fascia programmata...contattare il servizio di assistenza', 'Porta richiesta permesso in programmazione fasce');
//									return;
//								}
//							}
							var saved = globals.salvaEvento(evParams);
							if (!saved) 
							{
								globals.ma_utl_showErrorDialog('Dipendente : ' + globals.getNominativo(recRiga.idlavoratore)+ ' , ' + globals.dateFormat(recRiga.giorno,globals.EU_DATEFORMAT)+ ' - Si è verificato un errore, controllare in giornaliera di budget l\'esito della compilazione ed eventualmente contattare il servizio di assistenza', 'Porta richiesta permesso in giornaliera di budget');
								return;
							}
						}
					}
					else
					{
						globals.ma_utl_showErrorDialog('Non è stato possibile ottenere il riferimento alla ditta, contattare lo studio', 'Richiesta permessi');
					    return;
					}
			    }
				
			    if(inviaMail == true)
						globals.gestisciInvioComunicazione(rec.datarichiesta,
								                          rec.stato,
														  rec.approvatoil,
														  _to_sec_user$user_id.user_id,
														  rec.giorno_dal,
														  rec.giorno_al,
														  rec.lavoratori_giustificativitesta_to_lavoratori_giustificativirighe.dalleore,
														  rec.lavoratori_giustificativitesta_to_lavoratori_giustificativirighe.alleore,
														  globals.getUserIdFromIdLavoratore(rec.idlavoratore,_to_sec_owner$owner_id.owner_id.toString()),
														  rec.lavoratori_giustificativitesta_to_lavoratori_giustificativirighe.idevento,
														  null,
														  null,
														  null,
														  null,
														  noteRisposta);
								    
				
				
				
			}
		}
	}
	else
	   globals.ma_utl_showErrorDialog('Cannot go to find mode...', 'Richiesta permessi');
	
	return;
}

/**
 * @param {JSFoundset} fs
 *
 * @properties={typeid:24,uuid:"406A26FB-7557-4049-B033-E63F2CBD6575"}
 */
function FiltraDittaRP(fs)
{
	fs.addFoundSetFilterParam('idditta','IN',globals.getDitteControllateNonEsterne());
	fs.addFoundSetFilterParam('cessazione','^||>=',globals.TODAY);
	fs.loadAllRecords();
	return fs;
}

/**
 * @param {JSRenderEvent} event the render event
 * 
 * @properties={typeid:24,uuid:"53B0EBCE-A698-47FD-A357-8BDA0BDA4F93"}
 */
function onRenderVC(event)
{
	var _rec = event.getRecord();
	var _recRen = event.getRenderable();
    var _name = _recRen.getName();
    if(_name)
    {
    	var _length = _name.length;
    	var _dpId = utils.stringMiddle(_name,5,_length); //giorno_?
    	
    	if(!event.isRecordSelected())
    	{
    		if(event.getRecordIndex() % 2 == 0)
    	    {
    		    _recRen.bgcolor = globals.Colors.EVEN.background;
    		    _recRen.fgcolor = globals.Colors.EVEN.foreground;
    	    }
    	    else
    	    {
    	    	_recRen.bgcolor = globals.Colors.ODD.background;
    		    _recRen.fgcolor = globals.Colors.ODD.foreground;
    	    }
    		
    	    var gg = new Date(forms.giorn_visualizza_copertura_situazione.vDal.getFullYear(),
	              forms.giorn_visualizza_copertura_situazione.vDal.getMonth(),
				  forms.giorn_visualizza_copertura_situazione.vDal.getDate() + parseInt(utils.stringRight(_dpId,_dpId.length - 7), 10) - 1);
			
    	    if(gg && gg.getDay() == 0)
			{
				_recRen.bgcolor = globals.Colors.SUNDAY.background;
				_recRen.transparent = false;
            }
            else if(gg && gg.getDay() == 6)
            {
            	_recRen.bgcolor = globals.Colors.SATURDAY.background;
				_recRen.transparent = false;
            }
			
    	}
    	    	
	    switch(forms.giorn_visualizza_copertura_situazione.vTipoVisualizzazione)
		{
			case 1:
		    	if (_rec && _rec[_dpId])
			    {
				    switch (utils.stringRight(_rec[_dpId],1))
				    {                            
					   case globals.TipoAssenza.TOTALE:
					      _recRen.bgcolor = '#434343';
					      forms.giorn_visualizza_copertura_situazione.vChkDettaglioEvento ? _recRen.fgcolor = 'white' : _recRen.fgcolor = '#434343';
					      break;
					   case globals.TipoAssenza.PARZIALE:
					      _recRen.bgcolor = '#777777';
					      forms.giorn_visualizza_copertura_situazione.vChkDettaglioEvento ? _recRen.fgcolor = 'white' : _recRen.fgcolor = '#777777';
					      break;   
					   case globals.TipoAssenza.BUDGET:
					      _recRen.bgcolor = '#ff80ff'; 
					      forms.giorn_visualizza_copertura_situazione.vChkDettaglioEvento ? _recRen.fgcolor = 'white' : _recRen.fgcolor = '#ff80ff';
					      break;
					   case globals.TipoAssenza.RICHIESTA:
					      _recRen.bgcolor = '#0080ff';
					      forms.giorn_visualizza_copertura_situazione.vChkDettaglioEvento ? _recRen.fgcolor = 'white' : _recRen.fgcolor = '#0080ff';
					      break;
					   default:
						  break;
				    }
				
			    }
			    break;
			case 2:
				break;
			default:
				break;
		}
	    		
	}	
}

/**
 * @param {JSRenderEvent} event the render event
 * 
 * @properties={typeid:24,uuid:"69A30D5A-B626-4287-BF39-CDC62FD404E0"}
 */
function onRenderVC_Turni(event)
{
	var _rec = event.getRecord();
	var _recRen = event.getRenderable();
    var _name = _recRen.getName();
    if(_name)
    {
    	/** @type {String}*/
    	var value = _rec[utils.stringRight(_name,_name.length -4)];
    	
    	if(value)
    	{
	//    	var firstIndex = utils.stringPosition(value,'_',0,1);
			var secondIndex = utils.stringPosition(value,'_',0,2);
	//		var prefix = utils.stringLeft(value,firstIndex - 1);
	//		var g = value ? utils.stringMiddle(value,firstIndex + 1,value.length - secondIndex + 1) : null;
			var suffix = utils.stringRight(value,value.length - secondIndex);
	    	
	//    	if(!event.isRecordSelected())
	//    	{
	//    		if(event.getRecordIndex() % 2 == 0)
	//    	    {
	//    		    _recRen.bgcolor = globals.Colors.EVEN.background;
	//    		    _recRen.fgcolor = globals.Colors.EVEN.foreground;
	//    	    }
	//    	    else
	//    	    {
	//    	    	_recRen.bgcolor = globals.Colors.ODD.background;
	//    		    _recRen.fgcolor = globals.Colors.ODD.foreground;
	//    	    }
	//    		
	
	//    	    var gg = new Date(forms.giorn_prog_turni_visualizza_copertura_situazione.vDal.getFullYear(),
	//	              forms.giorn_prog_turni_visualizza_copertura_situazione.vDal.getMonth(),
	//				  forms.giorn_prog_turni_visualizza_copertura_situazione.vDal.getDate() + parseInt(- 1);
	//			
	//    	    if(gg && gg.getDay() == 0)
	//			{
	//				_recRen.bgcolor = globals.Colors.SUNDAY.background;
	//				_recRen.transparent = false;
	//            }
	//            else if(gg && gg.getDay() == 6)
	//            {
	//            	_recRen.bgcolor = globals.Colors.SATURDAY.background;
	//				_recRen.transparent = false;
	//            }
	//			
	//    	}
	    	    	
	    	if (_rec && value)
		    {
			    switch (suffix)
			    {                            
				   case globals.TipoAssenza.TOTALE:
				      _recRen.bgcolor = '#434343';
				      _recRen.fgcolor = 'white';
				      break;
				   case globals.TipoAssenza.PARZIALE:
				      _recRen.bgcolor = '#777777';
				      _recRen.fgcolor = 'white';
				      break;   
				   case globals.TipoAssenza.BUDGET:
				      _recRen.bgcolor = '#ff80ff'; 
				      _recRen.fgcolor = 'white';
				      break;
				   case globals.TipoAssenza.RICHIESTA:
				      _recRen.bgcolor = '#0080ff';
				      _recRen.fgcolor = 'white';
				      break;
				   case globals.TipoAssenza.NON_IN_TURNO:
				      _recRen.bgcolor = '#ff8000';
	//			      _recRen.toolTipText = 'Non di turno';   
				   default:
					  break;
			    }
			
		    }
    	}
	}	
}

/**
 * @param {JSRenderEvent} event the render event
 * 
 * @properties={typeid:24,uuid:"2DF0FBE4-2E45-47A5-A099-B0DA64661E11"}
 */
function onRenderVC_RP(event)
{
	var _rec = event.getRecord();
	var _recRen = event.getRenderable();
    var _name = _recRen.getName();
    if(_name)
    {
    	var _length = _name.length;
    	var _dpId = utils.stringMiddle(_name,5,_length); //giorno_?
    	
    	if(!event.isRecordSelected())
    	{
    		if(event.getRecordIndex() % 2 == 0)
    	    {
    		    _recRen.bgcolor = globals.Colors.EVEN.background;
    		    _recRen.fgcolor = globals.Colors.EVEN.foreground;
    	    }
    	    else
    	    {
    	    	_recRen.bgcolor = globals.Colors.ODD.background;
    		    _recRen.fgcolor = globals.Colors.ODD.foreground;
    	    }
    		
//    	    var gg = new Date(forms.rp_visualizza_copertura_situazione.vDal.getFullYear(),
//	              forms.rp_visualizza_copertura_situazione.vDal.getMonth(),
//				  forms.rp_visualizza_copertura_situazione.vDal.getDate() + parseInt(utils.stringRight(_dpId,_dpId.length - 7), 10) - 1);
//			
//    	    if(gg && gg.getDay() == 0)
//			{
//				_recRen.bgcolor = globals.Colors.SUNDAY.background;
//				_recRen.transparent = false;
//            }
//            else if(gg && gg.getDay() == 6)
//            {
//            	_recRen.bgcolor = globals.Colors.SATURDAY.background;
//				_recRen.transparent = false;
//            }
			
    	}
    	    	
	    switch(forms.rp_visualizza_copertura_situazione.vTipoVisualizzazione)
		{
			case 1:
		    	if (_rec && _rec[_dpId])
			    {
				    switch (utils.stringRight(_rec[_dpId],1))
				    {                            
					   case globals.TipoAssenza.TOTALE:
					      _recRen.bgcolor = '#434343';
					      forms.rp_visualizza_copertura_situazione.vChkDettaglioEvento ? _recRen.fgcolor = 'white' : _recRen.fgcolor = '#434343';
					      break;
					   case globals.TipoAssenza.PARZIALE:
					      _recRen.bgcolor = '#777777';
					      forms.rp_visualizza_copertura_situazione.vChkDettaglioEvento ? _recRen.fgcolor = 'white' : _recRen.fgcolor = '#777777';
					      break;   
					   case globals.TipoAssenza.BUDGET:
					      _recRen.bgcolor = '#ff80ff'; 
					      forms.rp_visualizza_copertura_situazione.vChkDettaglioEvento ? _recRen.fgcolor = 'white' : _recRen.fgcolor = '#ff80ff';
					      break;
					   case globals.TipoAssenza.RICHIESTA:
					      _recRen.bgcolor = '#0080ff';
					      forms.rp_visualizza_copertura_situazione.vChkDettaglioEvento ? _recRen.fgcolor = 'white' : _recRen.fgcolor = '#0080ff';
					      break;
					   case globals.TipoAssenza.NON_IN_TURNO:
					      _recRen.bgcolor = '#ff8000';
					      _recRen.toolTipText = 'Non di turno';
					      forms.rp_visualizza_copertura_situazione.vChkGruppoFasce ? _recRen.fgcolor = 'white' : _recRen.fgcolor = '#0080ff';
					      break; 
					   case globals.TipoAssenza.IN_TURNO:
						   _recRen.toolTipText = 'Di turno';
						   break;
					   default:
						  break;
				    }
				
			    }
			    break;
			case 2:
				break;
			default:
				break;
		}
	    		
	}	
}

/**
 * Apre il menu popup per la gestione in visualizzazione copertura
 * 
 * @param {JSEvent} event
 * @AllowToRunInFind 
 * 
 * @properties={typeid:24,uuid:"3366E762-BA2F-4BED-B3E5-07040F6746A2"}
 */
function ApriPopupVC(event)
{
	var source = event.getSource();
	var frm = event.getFormName();
	var fs = forms[frm].foundset;
	var id = fs[utils.stringMiddle(event.getElementName(),5,event.getElementName().length)];
	var suffix = utils.stringRight(id,1);
	
	var popUpMenu = plugins.window.createPopupMenu();
	
	// nel caso l'utente abbia l'accesso alla gestione della giornaliera
	if(globals.ma_utl_hasKey(globals.Key.RILEVAZIONE_PRESENZE))
	{
		var giornItem = popUpMenu.addMenuItem('Vai alla giornaliera',vaiAllaGiornaliera);
	    if(id)
	    {
		   giornItem.methodArguments = [event,parseInt(utils.stringMiddle(id,1,id['length'] - 1),10)];
	       giornItem.enabled = true;   
	    }   
	    else
		   giornItem.enabled = false;
		
	    popUpMenu.addSeparator();
	}
		
	if (globals.ma_utl_hasKey(globals.Key.RICHIESTA_PERMESSI_CR)) 
	{
		var bAutorizzazioneDisabilitata = globals.ma_utl_hasKey(globals.Key.RICHIESTA_PERMESSI_NO_APPROVAZIONE);
		
		// situazione della pianificazione ferie
		var pianificazioneItem = popUpMenu.addMenuItem('Informazioni sul piano ferie',calcTooltip);
		pianificazioneItem.methodArguments = [event,fs['idlavoratore'],forms.giorn_visualizza_copertura_situazione.vDal ? forms.giorn_visualizza_copertura_situazione.vDal : forms.rp_visualizza_copertura_situazione.vDal];
		var coperturaItem = popUpMenu.addMenuItem('Copertura giornata',calcCoperturaGiorno);
		coperturaItem.methodArguments = [event,parseInt(utils.stringRight(event.getElementName(),event.getElementName().length - 11))];
		
		popUpMenu.addSeparator();

		switch (suffix) {
			case globals.TipoAssenza.BUDGET:
				var budgetItem = popUpMenu.addMenuItem('Porta evento in giornaliera normale', portaInGiornalieraNormale);
				budgetItem.methodArguments = [event, parseInt(utils.stringMiddle(id, 1, id['length'] - 1), 10)];
				budgetItem.enabled = !bAutorizzazioneDisabilitata;
				var eventoItem = popUpMenu.addMenuItem('Elimina evento', eliminaEventoBudget);
				eventoItem.methodArguments = [event, parseInt(utils.stringMiddle(id, 1, id['length'] - 1), 10)];
				eventoItem.enabled = !bAutorizzazioneDisabilitata;
				break;
			case globals.TipoAssenza.RICHIESTA:
				var infoItem = popUpMenu.addMenuItem('Visualizza richiesta', showInfoRichiesta);
				infoItem.methodArguments = [event, parseInt(utils.stringMiddle(id, 1, id['length'] - 1), 10)];
	    		var enabled = _to_sec_user$user_id.sec_user_to_sec_user_to_lavoratori && (fs['idlavoratore'] !== _to_sec_user$user_id.sec_user_to_sec_user_to_lavoratori.idlavoratore);
				var confermaItem = popUpMenu.addMenuItem('Conferma permesso', portaInGiornalieraBudget);
				confermaItem.methodArguments = [event, parseInt(utils.stringMiddle(id, 1, id['length'] - 1), 10)];
				confermaItem.enabled = enabled && !bAutorizzazioneDisabilitata;
				var rifiutaItem = popUpMenu.addMenuItem('Rifiuta permesso', rifiutaRichiesta);
				rifiutaItem.methodArguments = [event, parseInt(utils.stringMiddle(id, 1, id['length'] - 1), 10)];
				rifiutaItem.enabled = enabled && !bAutorizzazioneDisabilitata;
				break;
			default:
				break;
		}
		
		popUpMenu.addSeparator();
		
		var xlsItem = popUpMenu.addMenuItem('Esporta la situazione corrente',exportVisualizzaCopertura);
		xlsItem.methodArguments = [event];
		xlsItem.enabled = true;
	}		    
	if(source != null)
	   popUpMenu.show(source);
}

/**
 * Apre il menu popup per la gestione in situazione turni
 * 
 * @param {JSEvent} event
 * @AllowToRunInFind 
 * 
 * @properties={typeid:24,uuid:"C762CC01-6FD8-44E6-B80A-FDB36FF4D45B"}
 */
function ApriPopupVC_Turni(event)
{
	var source = event.getSource();
	var elemName = event.getElementName();
	var offset = parseInt(utils.stringRight(elemName,elemName.length - elemName.lastIndexOf('_') - 1),10);
	var frm = event.getFormName();
	var fs = forms[frm].foundset;
	var idLav = fs.getSelectedRecord()['idlavoratore'];
	var dal = forms.giorn_prog_turni_visualizza_copertura_situazione.vDal;
	var giorno = new Date(dal.getFullYear(),dal.getMonth(),dal.getDate() + offset);
	
	var popUpMenu = plugins.window.createPopupMenu();
	
	// nel caso l'utente abbia l'accesso alla gestione della giornaliera
	if(globals.ma_utl_hasKey(globals.Key.RILEVAZIONE_PRESENZE))
	{
	   var giornItem = popUpMenu.addMenuItem('Vai alla giornaliera',vaiAllaGiornalieraDip);
       giornItem.methodArguments = [event,idLav,giorno];
       giornItem.enabled = true;   
    
       popUpMenu.addSeparator();
	}
	
	var pgItem = popUpMenu.addMenuItem('Programmazione turni dipendente',apriProgrammazioneTurniDaMenu);
	pgItem.methodArguments = [event,
						 	  idLav,
							  globals.getDitta(idLav),
							  giorno.getFullYear(),
							  giorno.getMonth() + 1];
	
	popUpMenu.addSeparator();
	
//	if (globals.ma_utl_hasKey(globals.Key.RICHIESTA_PERMESSI_CR)) 
//	{
//		var bAutorizzazioneDisabilitata = globals.ma_utl_hasKey(globals.Key.RICHIESTA_PERMESSI_NO_APPROVAZIONE);
//		
//		// situazione della pianificazione ferie
//		var pianificazioneItem = popUpMenu.addMenuItem('Informazioni sul piano ferie',calcTooltip);
//		pianificazioneItem.methodArguments = [event,fs['idlavoratore'],forms.giorn_visualizza_copertura_situazione.vDal ? forms.giorn_visualizza_copertura_situazione.vDal : forms.rp_visualizza_copertura_situazione.vDal];
//		var coperturaItem = popUpMenu.addMenuItem('Copertura giornata',calcCoperturaGiorno);
//		coperturaItem.methodArguments = [event,parseInt(utils.stringRight(event.getElementName(),event.getElementName().length - 11))];
//		
//		popUpMenu.addSeparator();
//
//		switch (suffix) {
//			case globals.TipoAssenza.BUDGET:
//				var budgetItem = popUpMenu.addMenuItem('Porta evento in giornaliera normale', portaInGiornalieraNormale);
//				budgetItem.methodArguments = [event, parseInt(utils.stringMiddle(id, 1, id['length'] - 1), 10)];
//				budgetItem.enabled = !bAutorizzazioneDisabilitata;
//				var eventoItem = popUpMenu.addMenuItem('Elimina evento', eliminaEventoBudget);
//				eventoItem.methodArguments = [event, parseInt(utils.stringMiddle(id, 1, id['length'] - 1), 10)];
//				eventoItem.enabled = !bAutorizzazioneDisabilitata;
//				break;
//			case globals.TipoAssenza.RICHIESTA:
//				var infoItem = popUpMenu.addMenuItem('Visualizza richiesta', showInfoRichiesta);
//				infoItem.methodArguments = [event, parseInt(utils.stringMiddle(id, 1, id['length'] - 1), 10)];
//	    		var enabled = _to_sec_user$user_id.sec_user_to_sec_user_to_lavoratori && (fs['idlavoratore'] !== _to_sec_user$user_id.sec_user_to_sec_user_to_lavoratori.idlavoratore);
//				var confermaItem = popUpMenu.addMenuItem('Conferma permesso', portaInGiornalieraBudget);
//				confermaItem.methodArguments = [event, parseInt(utils.stringMiddle(id, 1, id['length'] - 1), 10)];
//				confermaItem.enabled = enabled && !bAutorizzazioneDisabilitata;
//				var rifiutaItem = popUpMenu.addMenuItem('Rifiuta permesso', rifiutaRichiesta);
//				rifiutaItem.methodArguments = [event, parseInt(utils.stringMiddle(id, 1, id['length'] - 1), 10)];
//				rifiutaItem.enabled = enabled && !bAutorizzazioneDisabilitata;
//				break;
//			default:
//				break;
//		}
//		
//		popUpMenu.addSeparator();
//		
//		var xlsItem = popUpMenu.addMenuItem('Esporta la situazione corrente',exportVisualizzaCopertura);
//		xlsItem.methodArguments = [event];
//		xlsItem.enabled = true;
//	}		    
	if(source != null)
	   popUpMenu.show(source);
}

/**
 * @param {Number} _itemInd
 * @param {Number} _parItem
 * @param {Boolean} _isSel
 * @param {String} _parMenTxt
 * @param {String} _menuTxt
 * @param {JSEvent} _event 
 * @param {Number} _indiceGiorno
 *
 * @properties={typeid:24,uuid:"7A90DCAA-0C46-4ED0-AD17-9E13AD6D8316"}
 * @AllowToRunInFind 
 */
function calcCoperturaGiorno(_itemInd, _parItem, _isSel, _parMenTxt, _menuTxt,_event,_indiceGiorno)
{
	var frm = forms.giorn_visualizza_copertura;
	var fs = frm.foundset;
	var dal = forms.giorn_visualizza_copertura_situazione.vDal ? forms.giorn_visualizza_copertura_situazione.vDal : forms.rp_visualizza_copertura_situazione.vDal;
	var giorno = new Date(dal.getFullYear(),dal.getMonth(),dal.getDate() + _indiceGiorno - 1);
    var totOreTeoricheGiorno = 0;
    var totOreAssenzaGiorno = 0;
	
    // vengono tolti i filtri sui lavoratori per consentire il calcolo corretto della percentuale sul reparto
    databaseManager.removeTableFilterParam(globals.Server.MA_ANAGRAFICHE,'ftr_dati_lavoratori_gerarchia');
    
	for(var l=1; l<=fs.getSize(); l++)
	{
		totOreTeoricheGiorno += globals.ottieniOreTeoricheGiorno(fs.getRecord(l).idlavoratore,giorno)/100;
		totOreAssenzaGiorno += (globals.getTotaleOreSostitutiveInBudget(fs.getRecord(l).idlavoratore,giorno,giorno) 
				                + globals.getTotaleOreSostitutiveRichieste(fs.getRecord(l).idlavoratore,giorno,giorno)) 
//										globals.getTotOreSostitutiveUtilizzate(fsGe.idgiornaliera));
	}
	
	// vengono riaggiunti i filtri dovuti alla gerarchia
	databaseManager.addTableFilterParam
	(
		globals.Server.MA_ANAGRAFICHE,
		globals.Table.LAVORATORI,
		'idlavoratore',
		globals.ComparisonOperator.IN,
		globals.ma_sec_setUserHierarchy(globals.svy_sec_lgn_user_org_id,
			                            globals.ma_sec_lgn_groupid),
		'ftr_dati_lavoratori_gerarchia'
	);
		
//		var msg = 'Totale ore teoriche del giorno : ' + totOreTeoricheGiorno + " <br/>";
//		msg += 'Totale ore assenza del giorno : ' + totOreAssenzaGiorno + " <br/>";
	var msg = '% Copertura : ' + ((
						(totOreTeoricheGiorno - totOreAssenzaGiorno)/totOreTeoricheGiorno)*100
				).toFixed();
		
		globals.ma_utl_showInfoDialog(msg,'Informazioni copertura per il giorno ' + globals.getNumGiorno(giorno) + ' ' + globals.getNomeMese(giorno.getMonth()+1) + '  ' + giorno.getFullYear());
	
}

/**
 * @param {Number} _itemInd
 * @param {Number} _parItem
 * @param {Boolean} _isSel
 * @param {String} _parMenTxt
 * @param {String} _menuTxt
 * @param {JSEvent} _event 
 * @param {Number} _idGiornalieraEventi
 *  
 * @properties={typeid:24,uuid:"9AF6597B-F4C5-48E4-8633-8D33C84198DC"}
 * @AllowToRunInFind
 */
function vaiAllaGiornaliera(_itemInd, _parItem, _isSel, _parMenTxt, _menuTxt,_event,_idGiornalieraEventi)
{
	/**  @type {JSFoundset<db:/ma_presenze/e2giornalieraeventi>}*/
	var fs = databaseManager.getFoundSet(globals.Server.MA_PRESENZE,globals.Table.GIORNALIERA_EVENTI);
	if(fs.find())
	{
		fs.idgiornalieraeventi = _idGiornalieraEventi;
		if(fs.search())
		{
	       globals.apriGiornaliera(
	    	   _event,
		       fs.e2giornalieraeventi_to_e2giornaliera.e2giornaliera_to_lavoratori.idditta,
			   fs.e2giornalieraeventi_to_e2giornaliera.giorno.getFullYear(),
			   fs.e2giornalieraeventi_to_e2giornaliera.giorno.getMonth() + 1,
			   null,
			   null,
			   fs.e2giornalieraeventi_to_e2giornaliera.e2giornaliera_to_lavoratori.lavoratori_to_ditte.ditte_to_ditte_sedi.ditte_sedi_to_ditte_sedigruppiinst.ditte_sedigruppiinst_to_e2sediinstallazione.idgruppoinst,
			   "");
	       globals.lookup(fs.e2giornalieraeventi_to_e2giornaliera.iddip,forms.giorn_header.controller.getName());
		}
	}
}

/**
 * @param {Number} _itemInd
 * @param {Number} _parItem
 * @param {Boolean} _isSel
 * @param {String} _parMenTxt
 * @param {String} _menuTxt
 * @param {JSEvent} _event 
 * @param {Number} _idLavoratore
 * @param {Date} _giorno
 *   
 * @properties={typeid:24,uuid:"BEA74711-5AB7-43A3-B32C-10BA43C984C5"}
 * @AllowToRunInFind
 */
function vaiAllaGiornalieraDip(_itemInd, _parItem, _isSel, _parMenTxt, _menuTxt,_event,_idLavoratore,_giorno)
{
	   globals.apriGiornaliera(
		   _event,
	       getDitta(_idLavoratore),
		   _giorno.getFullYear(),
		   _giorno.getMonth() + 1,
		   null,
		   null,
		   getGruppoInstallazioneLavoratore(_idLavoratore),
		   "");
       globals.lookup(_idLavoratore,forms.giorn_header.controller.getName());
	
}

/**
 * Porta in giornaliera normale l'evento originariamente in giornaliera di budget 
 * conteggiando (o compilando) il giorno
 *  
 * @param {Number} _itemInd
 * @param {Number} _parItem
 * @param {Boolean} _isSel
 * @param {String} _parMenTxt
 * @param {String} _menuTxt
 * @param {JSEvent} _event 
 * @param {Number} _idGiornalieraEventi
 *
 * @properties={typeid:24,uuid:"B3D18934-C1A6-4F28-83ED-CAAD5562E564"}
 * @AllowToRunInFind
 */
function portaInGiornalieraNormale(_itemInd, _parItem, _isSel, _parMenTxt, _menuTxt,_event, _idGiornalieraEventi)
{
	/**  @type {JSFoundset<db:/ma_presenze/e2giornalieraeventi>}*/
	var fs = databaseManager.getFoundSet(globals.Server.MA_PRESENZE,globals.Table.GIORNALIERA_EVENTI);
	if(fs.find())
	{
		fs.idgiornalieraeventi = _idGiornalieraEventi;
		if(fs.search())
		{
			conteggiaDaBudget( fs.e2giornalieraeventi_to_e2giornaliera.e2giornaliera_to_lavoratori.idditta,
				              [fs.e2giornalieraeventi_to_e2giornaliera.iddip],
							  [fs.e2giornalieraeventi_to_e2giornaliera.giorno.getDate()],
							   false,
							   fs.e2giornalieraeventi_to_e2giornaliera.giorno,
							   globals.TipoGiornaliera.BUDGET);

		}
	}
		
}

/**
 * Elimina l'evento presente in giornaliera di budget 
 *  
 * @param {Number} _itemInd
 * @param {Number} _parItem
 * @param {Boolean} _isSel
 * @param {String} _parMenTxt
 * @param {String} _menuTxt
 * @param {JSEvent} _event 
 * @param {Number} _idGiornalieraEventi
 *
 * @AllowToRunInFind
 *
 * @properties={typeid:24,uuid:"FA4DDE9A-BF8B-4F55-8996-83B2E259BC15"}
 */
function eliminaEventoBudget(_itemInd, _parItem, _isSel, _parMenTxt, _menuTxt,_event, _idGiornalieraEventi)
{
	/**  @type {JSFoundset<db:/ma_presenze/e2giornalieraeventi>}*/
	var fs = databaseManager.getFoundSet(globals.Server.MA_PRESENZE,globals.Table.GIORNALIERA_EVENTI);
	if(fs.find())
	{
		fs.idgiornalieraeventi = _idGiornalieraEventi;
		if(fs.search())
		{
			var params = globals.inizializzaParametriEvento(
			                    fs.e2giornalieraeventi_to_e2giornaliera.e2giornaliera_to_lavoratori.idditta,
			                    fs.e2giornalieraeventi_to_e2giornaliera.giorno.getFullYear() * 100 + fs.e2giornalieraeventi_to_e2giornaliera.giorno.getMonth() + 1,
			                    0,
			                    [fs.e2giornalieraeventi_to_e2giornaliera.giorno.getDate()], 
			                    globals.TipoGiornaliera.BUDGET, 
			                    globals._tipoConnessione,
			                    [fs.e2giornalieraeventi_to_e2giornaliera.iddip],
			                    fs.e2giornalieraeventi_to_e2eventi.idevento,
			                    fs.e2giornalieraeventi_to_eventiproprieta.codiceproprieta,
                                fs.ore,
                                fs.valore,
                                fs.e2giornalieraeventi_to_e2eventi.idevento,
			                    fs.e2giornalieraeventi_to_eventiproprieta.codiceproprieta,
			                    0
		                 );

		    if(!scopes.giornaliera.cancellaChiusuraDipPerOperazione([fs.e2giornalieraeventi_to_e2giornaliera.iddip],
		    														 fs.e2giornalieraeventi_to_e2giornaliera.e2giornaliera_to_lavoratori.idditta))
		    {
		    	globals.ma_utl_showErrorDialog('Impossibile notificare la modifica','Elimina evento di budget');
				return;
		    }

		    var _retObj = globals.eliminaEvento(params);
		    if(!_retObj.returnValue)
		    {
		    	globals.ma_utl_showErrorDialog('Eliminazione evento non riuscita, riprovare','Elimina evento di budget');
		        return;
		    }
		    else
		    {
		    	var paramsCopAss = {
			        processFunction: process_refresh_copertura_assenze,
			        message: '', 
			        opacity: 0.5,
			        paneColor: '#434343',
			        textColor: '#EC1C24',
			        showCancelButton: false,
			        cancelButtonText: '',
			        dialogName : 'This is the dialog',
			        fontType: 'Arial,4,35',
			        processArgs: [new JSEvent]
			    };
				plugins.busy.block(paramsCopAss);
		    }
		}
	}
	else
	    globals.ma_utl_showErrorDialog('Cannot go to find mode','Elimina evento di budget');
		
}

/**
 * Effettua la conferma della richiesta compilando la giornaliera di budget
 * @param {Number} _itemInd
 * @param {Number} _parItem
 * @param {Boolean} _isSel
 * @param {String} _parMenTxt
 * @param {String} _menuTxt
 * @param {JSEvent} _event 
 * @param {Number} _idGiustificativoRiga
 *
 * @properties={typeid:24,uuid:"F4F1CC10-764E-402E-B09E-6FE906426981"}
 * @AllowToRunInFind
 */
function portaInGiornalieraBudget(_itemInd, _parItem, _isSel, _parMenTxt, _menuTxt,_event,_idGiustificativoRiga)
{
	/** @type {JSFoundset<db:/ma_anagrafiche/lavoratori_giustificativirighe>}*/
	var fs = databaseManager.getFoundSet(globals.Server.MA_ANAGRAFICHE,'lavoratori_giustificativirighe');
	if(fs.find())
	{
		fs.idlavoratoregiustificativorighe = _idGiustificativoRiga;
		if(fs.search())
		{	
		   var invioMail = !globals.ma_utl_hasKey(globals.Key.NON_INVIARE_MAIL);
		   if(invioMail)
			   globals.ma_utl_showYesNoQuestion('Inviare una mail per informare il/i dipendenti?','Invia mail di gestione richiesta');	
		   gestisciRichiesta(fs.idlavoratoregiustificativotesta,1,invioMail);
		   var paramsCopAss = {
		        processFunction: process_refresh_copertura_assenze,
		        message: '', 
		        opacity: 0.5,
		        paneColor: '#434343',
		        textColor: '#EC1C24',
		        showCancelButton: false,
		        cancelButtonText: '',
		        dialogName : 'This is the dialog',
		        fontType: 'Arial,4,35',
		        processArgs: [new JSEvent]
		    };
			plugins.busy.block(paramsCopAss);
		}
		else
			globals.ma_utl_showErrorDialog('Errore nel recupero delle informazioni sulla richiesta','Conferma richiesta in sospeso');
	}
	else
		globals.ma_utl_showErrorDialog('Cannot go to find mode','Conferma richiesta in sospeso');
	 
}

/**
 * @AllowToRunInFind
 * 
 * Effettua il rifiuto della richiesta
 * 
 * @param {Number} _itemInd
 * @param {Number} _parItem
 * @param {Boolean} _isSel
 * @param {String} _parMenTxt
 * @param {String} _menuTxt
 * @param {JSEvent} _event 
 * @param {Number} _idGiustificativoRiga
 * 
 * @properties={typeid:24,uuid:"08B92BFD-7C62-460B-8D04-874AA0CCA0AB"}
 */
function rifiutaRichiesta(_itemInd, _parItem, _isSel, _parMenTxt, _menuTxt,_event,_idGiustificativoRiga)
{
	/** @type {JSFoundset<db:/ma_anagrafiche/lavoratori_giustificativirighe>}*/
	var fs = databaseManager.getFoundSet(globals.Server.MA_ANAGRAFICHE,'lavoratori_giustificativirighe');
	if(fs.find())
	{
		fs.idlavoratoregiustificativorighe = _idGiustificativoRiga;
		if(fs.search())
		{	
		   var invioMail = !globals.ma_utl_hasKey(globals.Key.NON_INVIARE_MAIL); 
		   if(invioMail)
		      invioMail = globals.ma_utl_showYesNoQuestion('Inviare una mail per informare il/i dipendenti?','Invia mail di gestione richiesta');	 
		   gestisciRichiesta(fs.idlavoratoregiustificativotesta,0,invioMail);
		   var paramsCopAss = {
		        processFunction: process_refresh_copertura_assenze,
		        message: '', 
		        opacity: 0.5,
		        paneColor: '#434343',
		        textColor: '#EC1C24',
		        showCancelButton: false,
		        cancelButtonText: '',
		        dialogName : 'This is the dialog',
		        fontType: 'Arial,4,35',
		        processArgs: [new JSEvent]
		    };
			plugins.busy.block(paramsCopAss);

		}
		else
			globals.ma_utl_showErrorDialog('Errore nel recupero delle informazioni sulla richiesta','Conferma richiesta in sospeso');
	}
	else
		globals.ma_utl_showErrorDialog('Cannot go to find mode','Conferma richiesta in sospeso');
}

/**
 * Elimina la richiesta precedentemente evasa e reimposta la situazione in giornaliera di budget
 *  
 * @param {Number} _itemInd
 * @param {Number} _parItem
 * @param {Boolean} _isSel
 * @param {String} _parMenTxt
 * @param {String} _menuTxt
 * @param {JSEvent} event
 * @param {Number} idGiustificativoTesta
 *
 * @properties={typeid:24,uuid:"4BC8686E-950C-417A-B22C-4FA653CACBDF"}
 * @AllowToRunInFind
 */
function eliminaRichiestaEvasa(_itemInd, _parItem, _isSel, _parMenTxt, _menuTxt,event,idGiustificativoTesta)
{
	// recuperiamo le informazioni sui giorni relativi alla richiesta che si vuole revocare
	/** @type {JSFoundset<db:/ma_anagrafiche/lavoratori_giustificativirighe>} */
	var fsRighe = databaseManager.getFoundSet(globals.Server.MA_ANAGRAFICHE,globals.Table.RP_RIGHE);
	if(fsRighe.find())
	{
		fsRighe.idlavoratoregiustificativotesta = idGiustificativoTesta;
		if(fsRighe.search())
		{
		   var anno = fsRighe.giorno.getFullYear();
		   var mese = fsRighe.giorno.getMonth() + 1;
		   var periodo = anno * 100 + mese;	
		   
		   if(fsRighe.idlavoratore == null)
		   {
			   globals.ma_utl_showWarningDialog('Richiesta inserita con metodo precedente e non eliminabile','Elimina richiesta evasa');
			   return;
		   }
		   
		   var idDitta = globals.getDitta(fsRighe.idlavoratore);
		   if(globals.isDittaMesePrecedente(idDitta,periodo) == 1)
		   {
			   if(mese == 12)
			   {
				   mese = 1;
				   anno++;
			   }
			   else
				   mese++;
		   }
		   
		   var periodoRiferimentoCedolino = anno * 100 + mese;
	       var ultimoCedolinoStampato = globals.ma_utl_getUltimoCedolinoStampato(globals.convert_DitteCliente2Sede(idDitta));
	             
		   if(ultimoCedolinoStampato >= periodoRiferimentoCedolino)
	       {
		      globals.ma_utl_showWarningDialog('Non è possibile eliminare richieste già evase e relative a periodi precedentemente elaborati','Elimina richiesta');
		      return; 
	       }
	       
	       var _answer = globals.ma_utl_showYesNoQuestion('Eliminare la richiesta selezionata ed i relativi eventi in giornaliera di budget ? \n' + 
	    	                                              'NB: controllare che l\'evento non sia già stato portato in giornaliera normale','Elimina richiesta');
           if(_answer)
           {
        	   // per ogni giorno corrispondente, elimina l'evento presente nella giornaliera di budget
        	   // N.B. se la giornata è già stata conteggiata e presenta eventi in giornaliera normale, questi non verranno modificati
    			for(var row = 1; row <= fsRighe.getSize(); row++)
    			{
    				var recRiga = fsRighe.getRecord(row);
    				var recEvParams = globals.inizializzaParametriEvento(recRiga.lavoratori_giustificativirighe_to_lavoratori_giustificativitesta.lavoratori_giustificativitesta_to_lavoratori.idditta,
    					                                                 recRiga.giorno.getFullYear()*100 + recRiga.giorno.getMonth() + 1,
																		 0,
																		 [recRiga.giorno.getDate()],
																		 globals.TipoGiornaliera.BUDGET,
																		 globals.TipoConnessione.CLIENTE,
																		 [recRiga.idlavoratore],
																		 recRiga.idevento,
																		 recRiga.proprieta,
																		 recRiga.ore,
																		 recRiga.importo,
																		 0,
																		 "",
																		 recRiga.giornointero);
    				
                    // elimina l'evento dalla giornaliera di budget
    				var objElimina = globals.eliminaEvento(recEvParams);
    				if(objElimina.returnValue == false)
    				   globals.ma_utl_showWarningDialog('Controllare la giornaliera di budget per il dipendente' +
    					                                globals.getNominativo(recRiga.idlavoratore) +
														' nel giorno ' + recRiga.giorno,'Elimina richiesta');
    			}
    			
    			// salvataggio informazioni per eventuale mail di avviso al dipendente
    			/** @type {JSFoundset<db:/ma_anagrafiche/lavoratori_giustificativitesta>} */
			    var recTesta = recRiga.lavoratori_giustificativirighe_to_lavoratori_giustificativitesta;
			    var idLavoratore = recRiga.idlavoratore;
    			var dalleOre = recTesta.lavoratori_giustificativitesta_to_lavoratori_giustificativirighe.dalleore;
         	    var alleOre = recTesta.lavoratori_giustificativitesta_to_lavoratori_giustificativirighe.alleore;
                var dataRichiesta = recTesta.datarichiesta;
                var stato = recTesta.stato;
				var approvatoIl = recTesta.approvatoil;
				var giornoDal = recTesta.giorno_dal;
				var giornoAl = recTesta.giorno_al;				   
				var idEvento = recRiga.idevento;
    			
    			// eliminazione record giustificativo testa
    	 	    if(!fsRighe.lavoratori_giustificativirighe_to_lavoratori_giustificativitesta.deleteRecord())
    	 	    {
    			    globals.ma_utl_showWarningDialog('Errore durante l\'eliminazione della richiesta, contattare il servizio di assistenza','Elimina richiesta permesso');
    	 	        return;
    	 	    }
    	 	    
    			if(globals.ma_utl_showYesNoQuestion('Inviare una comunicazione al dipendente?','Elimina richiesta'))
    			{
					globals.gestisciInvioComunicazione(dataRichiesta,
						    	                       stato,
													   approvatoIl,
													   _to_sec_user$user_id.user_id,
													   giornoDal,
													   giornoAl,
													   dalleOre,
													   alleOre,
													   globals.getUserIdFromIdLavoratore(idLavoratore,_to_sec_owner$owner_id.owner_id.toString()),
													   idEvento,
													   true);
    			}
    			    			
    		}
    	    	    
         }
         else
     		globals.ma_utl_showWarningDialog('Non esistono giornate associate alla richiesta evasa');
	}
	
}

/**
 * @param {Number} idDitta
 * @param {Array} employeesIds
 * @param {Array} arrayGiorni
 * @param {Boolean} soloNonConteggiati
 * @param {Date} giorno
 * @param {String} tipoGiorn
 * 
 * @properties={typeid:24,uuid:"BB9B2211-85A1-40A2-8CED-983209D4833D"}
 */
function conteggiaDaBudget(idDitta, employeesIds, arrayGiorni, soloNonConteggiati, giorno, tipoGiorn)
{
	var periodo = giorno.getFullYear() * 100 + giorno.getMonth() + 1;
	var params = globals.inizializzaParametriCompilaConteggio
	            (
	                 idDitta,
	                 periodo,
	                 tipoGiorn,
	                 globals._tipoConnessione,
	                 arrayGiorni,
	                 employeesIds,
					 soloNonConteggiati != null ? soloNonConteggiati : false
	             );
	
	//lanciamo il calcolo per la compilazione 
	var url = WS_RFP_URL + "/Timbrature/Conteggia";
	
	var msg =  "Portare l'evento dalla giornaliera di budget alla normale?";
	var answer = globals.ma_utl_showYesNoQuestion(msg ,'Porta in giornaliera');
	
	if (answer) 
	{
		//teniamo traccia dei dipendenti che sono stati modificati e che risulteranno da chiudere
		if(!scopes.giornaliera.cancellaChiusuraDipPerOperazione(employeesIds, idDitta, periodo))
		{
			globals.ma_utl_showErrorDialog('Impossibile notificare la modifica','Porta in giornaliera normale');
			return;
		}
		else
			globals.getWebServiceResponse(url + 'Singolo', params);
	
		var paramsCopAss = {
	        processFunction: process_refresh_copertura_assenze,
	        message: '', 
	        opacity: 0.5,
	        paneColor: '#434343',
	        textColor: '#EC1C24',
	        showCancelButton: false,
	        cancelButtonText: '',
	        dialogName : 'This is the dialog',
	        fontType: 'Arial,4,35',
	        processArgs: [new JSEvent]
	    };
		plugins.busy.block(paramsCopAss);
			
	} else
		return;
}

/**
 * Prepara e disegna la visualizzazione della copertura aggiornata
 * 
 * @param params
 *
 * @properties={typeid:24,uuid:"032AF525-397B-4DA5-8A4B-253F5ECBC417"}
 */
function process_refresh_copertura_assenze(params)
{
	try
	{
		forms.giorn_visualizza_copertura.refreshCoperturaAssenze(new JSEvent);
	}
	catch(ex)
	{
		var msg = 'Metodo process_refresh_copertura_assenze : ' + ex.message;
		globals.ma_utl_showErrorDialog(msg)
		globals.ma_utl_logError(msg,LOGGINGLEVEL.ERROR);
	}
	finally
	{
		plugins.busy.unblock();
	}
}

/**
 * @param {Number} _itemInd
 * @param {Number} _parItem
 * @param {Boolean} _isSel
 * @param {String} _parMenTxt
 * @param {String} _menuTxt
 * @param {JSEvent} _event 
 * @param {Number} _idGiustificativoRiga 
 *
 * @properties={typeid:24,uuid:"A54EB431-7793-4867-BF1B-E3BFC595F31B"}
 * @AllowToRunInFind
 */
function showInfoRichiesta(_itemInd,_parItem,_isSel,_parMenTxt,_menuTxt,_event,_idGiustificativoRiga)
{
	/** @type {JSFoundset<db:/ma_anagrafiche/lavoratori_giustificativirighe>}*/
	var fsRighe = databaseManager.getFoundSet(globals.Server.MA_ANAGRAFICHE,'lavoratori_giustificativirighe');
	if(fsRighe.find())
	{
		fsRighe.idlavoratoregiustificativorighe = _idGiustificativoRiga;
		if(fsRighe.search())
		{
			var dal = fsRighe.lavoratori_giustificativirighe_to_lavoratori_giustificativitesta.giorno_dal;
			var al = fsRighe.lavoratori_giustificativirighe_to_lavoratori_giustificativitesta.giorno_al;
			
			var msg = 'Richiesta di ' + fsRighe.codevento + ' - ' + fsRighe.descrizione + ' ';
			msg += (dal != al) ? ('per il periodo che va dal giorno ' + globals.dateFormat(dal,globals.EU_DATEFORMAT) + 'al giorno ' + globals.dateFormat(al,globals.EU_DATEFORMAT)) 
					: (fsRighe.giornointero ? ('dalle ore ' + fsRighe.lavoratori_giustificativirighe_to_lavoratori_giustificativitesta.dalle_ore + 'alle ore ' 
							                   + fsRighe.lavoratori_giustificativirighe_to_lavoratori_giustificativitesta.alle_ore + 'del giorno ' + globals.dateFormat(dal,globals.EU_DATEFORMAT)) : ('per il giorno ' + globals.dateFormat(dal,globals.ISO_DATEFORMAT)));
			globals.ma_utl_showInfoDialog(msg,'Informazioni richiesta');
		}
		else
			globals.ma_utl_showErrorDialog('Recupero informazioni richiesta non riuscito','Informazioni richiesta');
	}
	else
	globals.ma_utl_showErrorDialog('Cannot go to find mode','Informazioni richiesta');
		
}

/**
 * @param {JSFoundset} fs
 * 
 * @properties={typeid:24,uuid:"2B54AD37-95B2-46F9-83CB-76C7091B3CD3"}
 */
function filterRichiesteDaConfermare(fs)
{
	fs.addFoundSetFilterParam('idlavoratore',globals.ComparisonOperator.IN,globals.foundsetToArray(forms.rp_elenco_richieste_da_evadere_tbl.foundset,'idlavoratore'))
	fs.addFoundSetFilterParam('stato','=',null);
	return fs;
}

/**
 * @param {Array<Number>} arrRichieste
 * 
 * @properties={typeid:24,uuid:"3390457C-DF18-4B1D-B0F8-3961ADFAC8C5"}
 */
function updateMultiploStatoRichiesta(arrRichieste)
{
	var invioMail = globals.ma_utl_showYesNoQuestion('Inviare una mail per informare il/i dipendenti?','Invia mail di gestione richiesta');
	
	for(var i=0; i<arrRichieste.length; i++)
		globals.gestisciRichiesta(arrRichieste[i],1,invioMail);
		
	globals.refreshElenco(new JSEvent,true);
}

/**
 * @param {Number} _itemInd
 * @param {Number} _parItem
 * @param {Boolean} _isSel
 * @param {String} _parMenTxt
 * @param {String} _menuTxt 
 * @param {JSEvent} event
 * 
 * @properties={typeid:24,uuid:"8B87E01F-C952-4AF4-9529-8DF03FC55007"}
 */
function confermaMultipla(_itemInd,_parItem,_isSel,_parMenTxt,_menuTxt,event)
{
	/** @type {Array<Number>} */
	var idRichieste = globals.svy_nav_showLookupWindow(event,
		                             null,
									 'RP_ElencoRichieste_Conferma',
									 null,
									 'filterRichiesteDaConfermare',
									 null,
									 null,
									 null,
									 true,
									 null,
									 null,
									 true									 
									 );
	
	if(idRichieste && idRichieste.length > 0)
		updateMultiploStatoRichiesta(idRichieste);
	
}

/**   
 * Esegue l'update dello stato della richiesta (conferma o rifiuto)
 *  
 * @param {Number} _itemInd
 * @param {Number} _parItem
 * @param {Boolean} _isSel
 * @param {String} _parMenTxt
 * @param {String} _menuTxt  
 * @param {JSEvent} event
 * @param {Number} status
 *
 * @properties={typeid:24,uuid:"0E8BEC3E-D236-4C9A-9242-E45E71BB8A30"}
 */
function updateStatoRichiesta(_itemInd, _parItem, _isSel, _parMenTxt, _menuTxt,event,status) 
{
	var frmName = event.getFormName();
	var noteAggiuntive = false;
	
	/** @type {Number} */
	var id = forms[frmName].foundset.getSelectedRecord()['idlavoratoregiustificativotesta'];
	
	var invioMail = !globals.ma_utl_hasKey(globals.Key.NON_INVIARE_MAIL) 
	                && globals.ma_utl_showYesNoQuestion('Inviare una mail per informare il dipendente?','Invia mail di gestione richiesta');
	
	// inserimento eventuale nota relativa alla gestione della richiesta
	if(invioMail)
	   noteAggiuntive = globals.ma_utl_showYesNoQuestion('Vuoi aggiungere delle note aggiuntive da comunicare al dipendente?','Invia mail di gestione richiesta');
	
	if(noteAggiuntive)
	{
		var frm = forms.rp_note_risposta_richiesta;
		frm.idRichiesta = id;
		frm.statoRichiesta = status;
		frm.noteRichiesta = '';
		globals.ma_utl_showFormInDialog(frm.controller.getName(),'Note aggiuntive alla gestione della richiesta');
	}
	else
	{
		globals.gestisciRichiesta(id, status, invioMail);
		globals.refreshElenco(event, true);
	}
}

/**
 * @param {Number} _itemInd
 * @param {Number} _parItem
 * @param {Boolean} _isSel
 * @param {String} _parMenTxt
 * @param {String} _menuTxt
 * @param {JSEvent} _event
 * @param {Number} idDip
 * @param {Date} allaData
 *
 * @properties={typeid:24,uuid:"F780F0A8-FAD8-417E-9852-EF966820B201"}
 * @SuppressWarnings(unused)
 */
function calcTooltip(_itemInd,_parItem,_isSel,_parMenTxt,_menuTxt,_event,idDip,allaData)
{
	// in presenza di un socio o di un collaboratore il piano ferie non è definito
    if(globals.isSocioCollaboratore(idDip))
    {
    	globals.ma_utl_showInfoDialog('Per il dipendente (socio o collaboratore) non è previsto alcun piano ferie','Piano ferie dip. ' + globals.getNominativo(idDip));
    	return;
    }
	// recuperiamo il dataset dei ratei
	var dsRateiDip = ottieniDataSetRateiDip(idDip,allaData,true);
	// ferie godute nell'anno in corso
	var goduto_anno = dsRateiDip.getValue(1,8);
	// TODO ferie spettanti nell'anno in corso
	var spettanti_anno = 173 + 72;
    // ferie residue anni precedenti (compreso il precedente)
    var residue_precedenti  = dsRateiDip.getValue(1,4) + dsRateiDip.getValue(1,5);
    // totale ore PD in giornaliera di budget
    // TODO verificare il periodo per il calcolo 
    var budget_anno = getTotaleOreSostitutiveInBudget(idDip,
    	                                           new Date(allaData.getFullYear(),0,1),
												   new Date(allaData.getFullYear(),11,31));
    // totale ore PD che sono state pianificate come richieste non ancora confermate
    var pianificate_anno = getTotaleOreSostitutiveRichieste(idDip,
    	                                           new Date(allaData.getFullYear(),0,1),
												   new Date(allaData.getFullYear(),11,31));
    var msg = '<html> Godute nell\'anno : ' + goduto_anno //+ '<br/>';
    msg += ' Approvate da godere nell\'anno : ' + budget_anno + '<br/>';
    msg += ' Richieste da approvare nell\'anno : ' + pianificate_anno //+ '<br/>';
//    msg += ' Ancora da definire : ' + (spettanti_anno - goduto_anno - budget_anno - pianificate_anno);
//    msg += ' (Coperto il ' + (Math.ceil(((goduto_anno + budget_anno + pianificate_anno) / spettanti_anno)*100)) + '% annuale)<br/>';
//    msg += '<br/>';
//    msg += ' Residue precedenti : ' + residue_precedenti + '</html>';
    
    
    globals.ma_utl_showInfoDialog(msg,'Piano ferie dip. ' + globals.getNominativo(idDip));
}



/**
 * @properties={typeid:24,uuid:"98FAF60B-5DDC-4B15-B1F6-48977A496C2C"}
 */
function FiltraEventiSelezionabiliRP()
{
	var sqlRP = "SELECT idEvento, Evento, descriz FROM E2Eventi \
              WHERE UsaInRichieste = 1 \
              AND idEventoClasse IN (SELECT idEventoClasse FROM E2EventiClassi WHERE Tipo NOT IN ('M')) \
              AND idEvento IN (" + globals._arrIdEvSelezionabili.join(',') + ");";
	var dsRP = databaseManager.getDataSetByQuery(globals.Server.MA_PRESENZE,sqlRP,null,-1);
	
	globals._arrIdEvSelezionabili = dsRP.getMaxRowIndex() > 0 ? dsRP.getColumnAsArray(1) : [];
}

/**
 * @properties={typeid:24,uuid:"B644132B-0210-4C80-95CC-53766D86C268"}
 */
function selezione_stampa_situazione_richieste()
{
	var frm = forms.rp_stampa_situazione_richieste;
	globals.ma_utl_setStatus(globals.Status.EDIT,frm.controller.getName());
	globals.ma_utl_showFormInDialog(frm.controller.getName(),'Stampa situazione richieste');
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 * @properties={typeid:24,uuid:"CF94730D-9F33-4CAE-B4F1-721A6B5A52CF"}
 */
function selezione_impostazioni_ferie_permessi(event) 
{
	var frm = forms.rp_parametri;
	globals.ma_utl_setStatus(globals.Status.EDIT,frm.controller.getName());
	globals.ma_utl_showFormInDialog(frm.controller.getName(),'Impostazioni parametri per gestione richieste');
}

/**
 * Recupera e restituisce il dataset con i dati relativi alle informazioni sui ratei del reparto alla data scelta
 * 
 * @param {Array<Number>} arrDip
 * @param {Date} allaData
 * @param {Boolean} [soloRateiDipendente]
 * 
 * @return {JSDataSet}
 * 
 * @properties={typeid:24,uuid:"B7C3A7E0-838D-4786-B49E-36F5313EB89C"}
 */
function ottieniDataSetRateiReparto(arrDip,allaData,soloRateiDipendente)
{
	var vQuery = "SELECT Reparto.CodiceRateo \
		       ,Reparto.Descrizione \
		       ,SUM (Reparto.Residuo2AP) AS Residuo2AP \
			   ,SUM (Reparto.ResiduoIniziale) AS ResiduoIniziale \
			   ,SUM (Reparto.MaturatoAnno) AS MaturatoAnno \
			   ,SUM (Reparto.MaturatoMese) AS MaturatoMese \
			   ,SUM (Reparto.GodutoAnno) AS GodutoAnno \
			   ,SUM (Reparto.GodutoMese) AS GodutoMese \
			   ,SUM (Reparto.Accantonate) AS Accantonate \
			   ,SUM (Reparto.LiquidatoAnno) AS LiquidatoAnno \
			   ,SUM (Reparto.Residuo) AS Residuo \
		FROM \
		( \
		SELECT \
				Calcolato.idDip \
				, Calcolato.CodiceRateo \
				,  Calcolato.Descrizione \
				, ISNULL(Res2Ap.Residuo2AP, 0) AS Residuo2AP \
				, ResiduoIniziale \
				, MaturatoAnno \
				, Calcolato.MaturatoAnno - Calcolato.MaturatoMP AS MaturatoMese \
				, GodutoAnno \
				, (Calcolato.GodutoAnno - Calcolato.GodutoMP) AS GodutoMese \
				, Accantonate \
				, LiquidatoAnno \
				, NumRateiMaturati \
				, (Calcolato.ResiduoIniziale + Calcolato.MaturatoAnno - Calcolato.GodutoAnno + Calcolato.Accantonate - Calcolato.LiquidatoAnno)  AS Residuo \
			FROM \
				( \
					SELECT \
						idDip \
						, CodiceRateo \
						, Descrizione \
						, SUM(CASE WHEN tiporateo = 'A' THEN valore ELSE 0 END) AS ResiduoIniziale \
						, SUM(CASE WHEN tiporateo = 'B' THEN valore ELSE 0 END) AS MaturatoAnno \
						, SUM(CASE WHEN tiporateo = 'I' THEN valore ELSE 0 END) AS Accantonate \
						, SUM(CASE WHEN tiporateo = 'C' THEN valore ELSE 0 END) AS GodutoAnno \
						, SUM(CASE WHEN tiporateo = 'E' THEN valore ELSE 0 END) AS LiquidatoAnno \
						, SUM(CASE WHEN tiporateo = 'C' THEN (CASE WHEN (DataRateo < CONVERT(datetime, '' + CAST(Year(?) AS Varchar)  + '-' + CAST(Month(?) AS VarChar) + '-01 00:00:00', 102)) OR (MP = 0) THEN valore ELSE 0 END) ELSE 0 END) AS GodutoMP \
						, SUM(CASE WHEN tiporateo = 'B' THEN (CASE WHEN (DataRateo < CONVERT(datetime, '' + CAST(Year(?) AS Varchar)  + '-' + CAST(Month(?) AS VarChar) + '-01 00:00:00', 102)) OR (MP = 0) OR (CR <> 'BO') THEN valore ELSE 0 END) ELSE 0 END) AS MaturatoMP \
						, SUM(CASE WHEN tipoRateo = 'B' THEN 1 ELSE 0 END) AS NumRateiMaturati \
					FROM \
					(\
							SELECT \
							CR \
							, DC \
							, MP \
							, RateiInizio.DataInizioRateo AS inizio \
							, RateiInizio.Descrizione \
							, RM.idDip \
							, RM.TipoRateo \
							, RM.CodiceRateo \
							, RM.DataRateo \
							, RM.Valore \
							, RM.ForzatoManuale \
						FROM \
							E2RateiMovimenti RM \
							FULL OUTER JOIN ( \
								SELECT \
									DR.Codice AS CodiceRateo \
									, DR.Descrizione \
									, ISNULL(ResiduoIniziale.DataUltimoRateo, CAST('1901-01-01 00:00' AS datetime)) AS DataInizioRateo \
									, DR.IdDitta \
									, L.idLavoratore AS IdDip \
									, L.CodGestionePresenze AS MP \
									, L.Cessazione AS DC \
									, (CASE WHEN ClasseRateo = 'BO' THEN 'BO' ELSE '' END) AS CR \
								FROM \
									( \
										SELECT \
											L.* \
										FROM \
											Lavoratori L \
										WHERE \
											idLavoratore IN (" + arrDip.map(function (d){return d}).join(',') + ") \
									) AS L \
									LEFT JOIN Ditte_Ratei DR \
									ON L.idDitta = DR.IdDitta \
									LEFT JOIN ( \
										SELECT \
											IdDip \
											, MAX(DataRateo) AS DataUltimoRateo \
											, CodiceRateo \
				                        FROM \
											E2RateiMovimenti RM \
				                        WHERE \
											(TipoRateo = 'A') \
											AND (RM.DataRateo <= ?) \
										GROUP BY \
											IdDip \
											, CodiceRateo \
									) ResiduoIniziale \
										ON L.idLavoratore = ResiduoIniziale.IdDip AND DR.Codice = ResiduoIniziale.CodiceRateo \
									LEFT JOIN E2RateiClassi RC \
										ON (CHARINDEX(',' + RC.ClasseRateo + ',', ',' + dbo.F_Ratei_Classi(DR.idDittaRateo) + ',') > 0) \
							) RateiInizio \
								ON RM.CodiceRateo = RateiInizio.CodiceRateo AND RM.DataRateo >= RateiInizio.DataInizioRateo AND RM.IdDip = RateiInizio.IdDip \
						WHERE \
							(RateiInizio.DataInizioRateo IS NOT NULL) \
							AND (RM.DataRateo <= ?) \
						GROUP BY \
							CR \
							, DC \
							, MP \
		 					, RateiInizio.DataInizioRateo \
							, RateiInizio.Descrizione \
							, RM.idDip \
							, RM.TipoRateo \
							, RM.CodiceRateo \
							, RM.DataRateo \
							, RM.Valore \
							, RM.ForzatoManuale \
				) AS Movimenti \
				GROUP BY \
					IdDip \
					, CR \
					, DC \
					, MP \
					, CodiceRateo \
					, Descrizione \
			) AS Calcolato \
			LEFT OUTER JOIN Lavoratori L \
				ON Calcolato.idDip = L.idLavoratore \
			LEFT JOIN F_Ratei_Res2AP(?) AS Res2AP \
				ON Res2AP.idLavoratore = Calcolato.idDip AND Res2AP.CodiceRateo = Calcolato.CodiceRateo \
		) Reparto ";

	if(soloRateiDipendente)
	    vQuery += "WHERE Reparto.CodiceRateo IN \
	                 (SELECT \
				       DR.Codice AS CodiceRateo \
				       FROM \
				       Ditte_RateiClassiMaturazione RCM \
				       INNER JOIN E2RateiClassi RC \
				             ON RCM.ClasseRateo = RC.ClasseRateo \
				       INNER JOIN Ditte_Ratei DR \
				             ON DR.idDittaRateo = RCM.idDittaRateo \
				       WHERE \
				       RC.MensSupplementare = 0 \
				       GROUP BY  \
				       DR.idDitta \
				       , DR.Codice) ";	
		
    vQuery += "GROUP BY \
				Reparto.CodiceRateo, \
				Reparto.Descrizione \
				ORDER BY \
				Reparto.Codicerateo ";
	    
	var vArr = new Array();
        var allaDataIso = utils.dateFormat(allaData,globals.ISO_DATEFORMAT);
        vArr.push(allaDataIso,allaDataIso,allaDataIso,allaDataIso,allaDataIso,allaDataIso,allaDataIso);
    var vDatasetRateiDip = databaseManager.getDataSetByQuery(globals.Server.MA_PRESENZE, vQuery, vArr, -1);    
        vDatasetRateiDip.addColumn('ResiduoAnnoPrec',vDatasetRateiDip.getMaxColumnIndex() + 1,JSColumn.NUMBER);
    
    for(var i=1; i <= vDatasetRateiDip.getMaxRowIndex(); i++)
       	vDatasetRateiDip.setValue(i,vDatasetRateiDip.getMaxColumnIndex(),vDatasetRateiDip.getValue(i,4) - vDatasetRateiDip.getValue(i,3));
        
    return vDatasetRateiDip;
}

/**
 * @param {Object} user_org_id
 * @param {Object} [user_group_id]
 * 
 * @return {Array}
 *
 * @properties={typeid:24,uuid:"5BA04E07-A44F-4BAC-B000-F52BD8097086"}
 */
function getUserHierarchy(user_org_id,user_group_id)
{
	var sqlQuery = "WITH RECURSIVE hierarchy(organization_id, parent_organization_id) AS\
					(\
						SELECT\
							organization_id,\
							CAST(NULL AS character varying(50)) AS parent_organization_id\
						FROM\
							sec_organization\
						WHERE\
							organization_id = (SELECT organization_id FROM sec_user_org WHERE user_org_id = ?)\
						\
						UNION ALL\
						\
						SELECT\
							soh.organization_id,\
							soh.parent_organization_id\
						FROM\
							sec_organization_hierarchy soh\
							INNER JOIN hierarchy h\
								ON soh.parent_organization_id = h.organization_id\
						WHERE\
							soh.organization_id <> soh.parent_organization_id\
					)\
					SELECT\
						  sutl.user_id\
						, sutl.idlavoratore\
					FROM\
						sec_user_to_lavoratori sutl\
						INNER JOIN sec_user su\
							ON su.user_id = sutl.user_id\
					WHERE\
						su.user_id IN\
						(\
							SELECT DISTINCT\
								suo.user_id\
							FROM\
								sec_user_in_group sug\
								INNER JOIN sec_group sg\
                                    ON sug.group_id = sg.group_id\
								INNER JOIN sec_user_org suo\
									ON suo.user_org_id = sug.user_org_id\
								INNER JOIN hierarchy h\
									ON h.organization_id = suo.organization_id\
								WHERE ";
	
		if(user_group_id && user_group_id != -1)
			sqlQuery += "sug.group_id = '" + user_group_id + "' AND ";
		
		sqlQuery += "h.organization_id <> (SELECT organization_id FROM sec_user_org WHERE user_org_id = ?)\
									OR\
									sug.user_org_id = ?\
						)\
					ORDER BY\
						su.user_id;";
	
	var dataset = databaseManager.getDataSetByQuery(globals.nav_db_framework, sqlQuery, [user_org_id, user_org_id, user_org_id], -1);
	if (dataset.getMaxRowIndex() > 0)
	{
		var arrLav = dataset.getColumnAsArray(2);
		arrLav.push(globals.getIdLavoratoreFromUserId(globals.svy_sec_user_id,globals.svy_sec_owner_id));
		return arrLav;
	}
	return null;
}

/**
 * @AllowToRunInFind
 * 
 * Restituisce il valore predefinito per l'evento appartenente alla classe richiesta
 *  
 * @param {Number} idEventoClasse
 *
 * @properties={typeid:24,uuid:"E890AB01-3E9E-492F-A956-989147D93F47"}
 */
function getProprietaPredefinitaEvento(idEventoClasse)
{
	/** @type {JSFoundSet<db:/ma_presenze/e2eventiclassiproprieta>}*/
	var fsEventi = databaseManager.getFoundSet(globals.Server.MA_PRESENZE,globals.Table.EVENTI_CLASSI_PROPRIETA);
	if(fsEventi.find())
	{
		fsEventi.ideventoclasse = idEventoClasse;
		fsEventi.predefinito = 1
		if(fsEventi.search())
		   return fsEventi.codiceproprieta;
	}
	
	return '';
}

/**
 * @param {Number} _itemInd
 * @param {Number} _parItem
 * @param {Boolean} _isSel
 * @param {String} _parMenTxt
 * @param {String} _menuTxt
 * @param {JSEvent} _event
 * 
 * @properties={typeid:24,uuid:"40AD81C9-EE70-4512-855A-1658D416BC6D"}
 */
function exportVisualizzaCopertura(_itemInd,_parItem,_isSel,_parMenTxt,_menuTxt,_event)
{
	// produzione file excel
	try
	{
		scopes.rp_reports.exportExcel_VC(_event);
	}
	catch(ex)
	{
		var msg = 'Metodo process_export_excel : ' + ex.message;
		globals.ma_utl_showErrorDialog(msg)
		globals.ma_utl_logError(msg,LOGGINGLEVEL.ERROR);
	}
	finally
	{
		plugins.busy.unblock();
	}
	
}

/**
 * TODO generated, please specify type and doc for the params
 * @param {JSRecord<db:/ma_anagrafiche/lavoratori_giustificativitesta>} rec
 *
 * @properties={typeid:24,uuid:"65F4249D-2942-4D5C-B6DC-FEED9742EC79"}
 */
function inviaMailRichiestaEsistente(rec)
{
	var idLavoratore = rec.idlavoratore;
	var idDitta = rec.lavoratori_giustificativitesta_to_lavoratori.idditta;
	var idLavoratoreGiustificativoTesta = rec.idlavoratoregiustificativotesta;
	var idUser = globals.getUserIdFromIdLavoratore(idLavoratore,globals.svy_sec_owner_id);
	var fsRpGroupsInfo;
	var fsRpUsersInfo;
	var infoTuple;
	var infoSup;
	var emailaddresses = [];
	var emailaddressesConfirm = [];
	var emailaddressesRefuse = [];
	var emailaddressesOthers = [];
	
	// gestione della stringa oggetto della mail a seconda del parametro impostato
	var bSubjectNom = false;
	switch (globals.getParameterValue(idDitta, 'NOE')) {
	case 'NOM': // il nominativo del richiedente comparirà nell'oggetto della mail
		bSubjectNom = true;
		break;
	case 'STD':
		bSubjectNom = false;
		break;
	default:
		break;
	}

	// gestione dell'invio mail di avvenuto inserimento di una nuova richiesta al gestore oppure nel caso
	// del gestore stesso che inserisce richieste per i suoi subordinati, al relativo subordinato
	var scIdMailSuperiore = globals.ma_utl_getSecurityKeyId(globals.Key.NON_INVIARE_MAIL);
	
	// gestione eventuale utilizzo lingua inglese
	var scIdEnglishLang = globals.ma_utl_getSecurityKeyId(globals.Key.ENGLISH_LAN);
	
	// determinazione dell'eventuale gap dei livelli per l'autorizzazione della gestione
	var livAut = 0;

	idUser = globals.svy_sec_lgn_organization_id;
	fsRpGroupsInfo = globals.getRpGroupsInfo(idUser);
	fsRpUsersInfo = globals.getRpUsersInfo(idUser);
	
	if (fsRpGroupsInfo || fsRpUsersInfo) {
		if (fsRpGroupsInfo) {
			for (var gr = 1; gr <= fsRpGroupsInfo.getSize(); gr++) {
				var users = globals.getOrganizationUsers(fsRpGroupsInfo.getRecord(gr).rp_group_id.toString());
				for (var au = 0; au < users.length; au++) {
					infoTuple = [users[au], globals.getMailUtente(users[au]), 1000];
					if (fsRpGroupsInfo.getRecord(gr).gestione_richiesta)
						emailaddresses.push(infoTuple);
					if (fsRpGroupsInfo.getRecord(gr).avviso_conferma && users[au] != idUser && emailaddressesConfirm.indexOf(users[au]) == -1)
						emailaddressesConfirm.push(users[au]);
					if (fsRpGroupsInfo.getRecord(gr).avviso_rifiuto && users[au] != idUser && emailaddressesRefuse.indexOf(users[au]) == -1)
						emailaddressesRefuse.push(users[au]);
					if (users[au] != globals.svy_sec_lgn_user_id && emailaddressesOthers.indexOf(users[au]) == -1 && emailaddressesConfirm.indexOf(users[au]) == -1 && emailaddressesRefuse.indexOf(users[au]) == -1
					)
						emailaddressesOthers.push(users[au]);
				}
			}
		}

		if (fsRpUsersInfo) {
			for (var us = 1; us <= fsRpUsersInfo.getSize(); us++) {
				infoTuple = [fsRpUsersInfo.getRecord(us).rp_user_id,
				globals.getMailUtente(fsRpUsersInfo.getRecord(us).rp_user_id), 1000];
				if (fsRpUsersInfo.getRecord(us).gestione_richiesta)
					emailaddresses.push(infoTuple);
				if (fsRpUsersInfo.getRecord(us).avviso_conferma && fsRpUsersInfo.getRecord(us).rp_user_id != idUser && emailaddressesConfirm.indexOf(fsRpUsersInfo.getRecord(us).rp_user_id) == -1)
					emailaddressesConfirm.push(fsRpUsersInfo.getRecord(us).rp_user_id);
				if (fsRpUsersInfo.getRecord(us).avviso_rifiuto && fsRpUsersInfo.getRecord(us).rp_user_id != idUser && emailaddressesRefuse.indexOf(fsRpUsersInfo.getRecord(us).rp_user_id) == -1)
					emailaddressesRefuse.push(fsRpUsersInfo.getRecord(us).rp_user_id);
				if (fsRpUsersInfo.getRecord(us).rp_user_id != idUser && emailaddressesOthers.indexOf(fsRpUsersInfo.getRecord(us).rp_user_id) == -1 && emailaddressesConfirm.indexOf(fsRpUsersInfo.getRecord(us).rp_user_id) == -1 && emailaddressesRefuse.indexOf(fsRpUsersInfo.getRecord(us).rp_user_id) == -1)
					emailaddressesOthers.push(fsRpUsersInfo.getRecord(us).rp_user_id);
			}
		}
	} else {
// TODO gestione caso generale gruppi		
//		var userGroupId;
//		var userGroups = globals.getUserGroups(idUser);
//		if(userGroups.getMaxRowIndex() != 1)
//		{
//			//TODO
//			globals.ma_utl_showWarningDialog('Più gruppi di appartenenza definiti per l\'utente, definire quale si desidera...');
//	    	return;
//		}
//		else
//			userGroupId = userGroups.getValue(1,1);
		var userGroupId = _to_sec_user$user_id.sec_user_to_sec_user_org.sec_user_org_to_sec_user_in_group.sec_user_in_group_to_sec_group.group_id;
		livAut = globals.getDeltaLivelloAutorizzazione(idUser,
													   idUser,
													   userGroupId);

		// recupero del/i corretto/i indirizzo/i mail a cui inviare l'avviso di avvenuto inserimento di richiesta
		infoSup = globals.getInfoUsersLivelliSuperiori(globals.svy_sec_lgn_user_org_id);

		for (var iu = 1; iu <= infoSup.getMaxRowIndex(); iu++) {
			if (infoSup.getValue(iu, 1) != _to_sec_user$user_id.user_id) {
				// se 1- il livello superiore rientra negli n livelli di profondità a cui cercare (di default il livello è pari a 1,
				//      altrimenti è indicato dal possesso delle chiavi del tipo RICHIESTA_PERMESSI_n_LIV)
				//    2- l'utente di questa organizzazione non è per qualche motivo inibito alla ricezione della mail di avvenuto
				//      inserimento della nuova richiesta
				// aggiungi il suo indirizzo all'array di indirizzi a cui mandare l'avviso
				if (infoSup.getValue(iu, 5) <= livAut && !globals.ma_utl_userHasKey(infoSup.getValue(iu, 1), scIdMailSuperiore, infoSup.getValue(iu, 6), infoSup.getValue(iu, 4))) {
					infoTuple = [infoSup.getValue(iu, 1), infoSup.getValue(iu, 3), infoSup.getValue(iu, 5), infoSup.getValue(iu, 4)];
					emailaddresses.push(infoTuple);
					emailaddressesOthers.push(infoSup.getValue(iu, 1)); //TODO
				}

			}
		}
	}
	
	// invio mail gestori richiesta
	for (var e = 0; e < emailaddresses.length; e++) {
		// costruzione intestazione e testo mail
		var subject = (bSubjectNom ? globals.getNominativo(idLavoratore) + " - " : "") + "Comunicazione presenza richiesta ferie e permessi - Presenza Semplice Studio Miazzo";
		var subjectEn = "Advice for request - Presenza Semplice Studio Miazzo";
		var msgText = "plain msg<html>";
		msgText += "<head><meta http-equiv=\"Content-Type\" content=\"text/html; charset=utf-8\"></head>";
		msgText += "<body>";
		var msgTextEn = msgText; 
		
		// link per il servizio di gestione richiesta con restful web service
		var url = globals.RfpServerLink +  
		          "/rp_servlet?idgiustificativotesta=" + idLavoratoreGiustificativoTesta + 
				  "&cliente=" + globals.customer_dbserver_name + 
				  "&operatore=" + emailaddresses[e][0] + 
				  "&wsurl=" + globals.WS_RFP_URL + 
				  "&userid=" + _to_sec_user$user_id.user_id + 
				  "&othersid=" + emailaddressesOthers.join(',') + 
				  "&confirmsid=" + emailaddressesConfirm.join(',') + 
				  "&refusesid=" + emailaddressesRefuse.join(',');

		if (emailaddresses[e] && plugins.mail.isValidEmailAddress(emailaddresses[e][1])) {
			msgText += "Gentile <b>" + globals.getUserName(emailaddresses[e][0]) + "</b>, <br/> con la presente le comunichiamo la presenza di una richiesta di ";
			msgTextEn += "Dear <b>" + globals.getUserName(emailaddresses[e][0]) + "</b>, <br/> we inform you that there is a request of <i>" + globals.getDescrizioneEvento(rec.lavoratori_giustificativitesta_to_lavoratori_giustificativirighe.idevento) + " ";

			msgText += '<i>' + globals.getDescrizioneEvento(rec.lavoratori_giustificativitesta_to_lavoratori_giustificativirighe.idevento) + '</i>';

			msgText += " da parte del" + (isFemmina ? "la" : "") + " dipendente <b>" + globals.getNominativo(idLavoratore) + '</b>';
			msgTextEn += " by <b>" + globals.getNominativo(idLavoratore) + '</b>';

			var vDal = rec.giorno_dal;
			var vAl = rec.giorno_al;
			
			if (vDal == vAl) {
				msgText += (" relativa al giorno <b>" + utils.dateFormat(vDal, globals.EU_DATEFORMAT)) + '</b>';
				msgTextEn += (" on the day <b>" + utils.dateFormat(vDal, globals.EU_DATEFORMAT)) + '</b>';

				if (!rec.lavoratori_giustificativitesta_to_lavoratori_giustificativirighe.giornointero) {
					msgText += " dalle ore " + utils.dateFormat(rec.lavoratori_giustificativitesta_to_lavoratori_giustificativirighe.dalleore, globals.OREMINUTI_DATEFORMAT);
					msgTextEn += " since " + utils.dateFormat(rec.lavoratori_giustificativitesta_to_lavoratori_giustificativirighe.dalleore, globals.OREMINUTI_DATEFORMAT);

					msgText += " alle ore " + utils.dateFormat(rec.lavoratori_giustificativitesta_to_lavoratori_giustificativirighe.alleore, globals.OREMINUTI_DATEFORMAT);
					msgTextEn += " until " + utils.dateFormat(rec.lavoratori_giustificativitesta_to_lavoratori_giustificativirighe.alleore, globals.OREMINUTI_DATEFORMAT);
				}
				msgText += ". <br/>";
				msgTextEn += ". <br/>";
			} else {
				msgText += (" relativa al periodo che va dalla data <b>" + utils.dateFormat(vDal, globals.EU_DATEFORMAT) + "</b> alla data <b>" + utils.dateFormat(vAl, globals.EU_DATEFORMAT) + "</b>. <br/>");
				msgTextEn += (" since <b>" + utils.dateFormat(vDal, globals.EU_DATEFORMAT) + "</b> until <b>" + utils.dateFormat(vAl, globals.EU_DATEFORMAT) + "</b>. <br/>");
			}

			msgText += '<br/>';
			msgTextEn += '<br/>';

			if (rec.note != null && rec.note != '') {
				msgText += 'Note della richiesta : ' + '<i>' + rec.note + '</i>';
				msgTextEn += 'Additional notes : ' + '<i>' + rec.note + '</i>';
			}

			msgText += '<br/><br/>';
			msgTextEn += '<br/><br/>';

			if ((emailaddresses[e][2] == 1000 || (livAut != undefined && emailaddresses[e][2] == livAut))) {
				msgText += '<a href= ' + url + "&status=1" + '>Confermare richiesta</a>';
				msgText += '<br/>';
				msgText += '<a href=' + url + "&status=2" + '>Rifiutare richiesta</a>';
				msgText += "<br/><br/>In alternativa collegarsi all\'<a href='https://webapp.studiomiazzo.it/login.html'>applicazione</a> per la gestione delle richieste."

				msgTextEn += '<a href= ' + url + "&status=1" + '>Confirm request</a>';
				msgTextEn += '<br/>';
				msgTextEn += '<a href=' + url + "&status=2" + '>Refuse request</a>';
				msgTextEn += "<br/><br/>Alternatively you can go to the <a href='https://webapp.studiomiazzo.it/login.html'>application</a> to handle the requests."
			}

			//							msgTextEn += '</p>';
			msgTextEn += "</body></html>";
			msgText += "</body></html>";

			// english language
			var englishLang = globals.ma_utl_userHasKey(emailaddresses[e][0],scIdEnglishLang);

			if (!plugins.mail.sendMail
										(emailaddresses[e][1],
										'Ferie e permessi <assistenza@studiomiazzo.it>',
										englishLang ? subjectEn : subject,
										englishLang ? msgTextEn : msgText,
										null,
										null,
										null,
										globals.setSparkPostSmtpProperties()))
				globals.ma_utl_showWarningDialog(plugins.mail.getLastSendMailExceptionMsg(), 'Comunicazione gestione richiesta');
			else
                globals.ma_utl_showWarningDialog('Inoltro della comunicazione avvenuto correttamente!','Comunicazione gestione richiesta');
		} else
			globals.ma_utl_showWarningDialog(emailaddresses[e][1] + ' : ' + 'i18n:ma.msg.notValidEmailAddress', 'Comunicazione gestione richiesta');
	}
}