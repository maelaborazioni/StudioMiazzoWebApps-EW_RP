/**
 * @type {Array<Number>}
 *
 * @properties={typeid:35,uuid:"71460529-39D3-44AF-BB14-804D7CD70FCC",variableType:-4}
 */
var arrDipReparto = [];

/**
 * @type {Array}
 * 
 * @properties={typeid:35,uuid:"AA7AAF72-A6B8-4994-9FBE-A2414997C70C",variableType:-4}
 */
var arrEventiFiltro = [];

/**
 * @type {Number}
 * 
 * @properties={typeid:35,uuid:"F8834514-3A74-4796-9245-60EC92293CD4",variableType:8}
 */
var pages;

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"289C4074-E2C9-4DFA-AA31-D4316382C017",variableType:4}
 */
var currPage = 1;

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"8B361805-4A1A-4921-AF23-C0DE7C222795",variableType:4}
 */
var dipPerPage = 6;

/**
 * @type {Number}
 * 
 * @properties={typeid:35,uuid:"7825211D-4982-462A-8097-67B26ABF1780",variableType:8}
 */
var annoRif = null;

/**
 * @type {Number}
 * 
 * @properties={typeid:35,uuid:"EED6DBDF-C98C-4F07-B662-559BD8E00462",variableType:8}
 */
var meseRif = null;

/**
 * @properties={typeid:35,uuid:"AABF38A4-3120-43D7-869E-6D341201B2C0",variableType:-4}
 */
var ggRif = null;

/**
 * @type {Date}
 * 
 * @properties={typeid:35,uuid:"9B59C76F-8923-40FF-82A2-20392104E8F6",variableType:93}
 */
var limitaAl = null;

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"A51811A8-FFD7-491A-A97A-951FA60E3B1E",variableType:4}
 */
var vOptGruppoId = -1;

/**
 * Recupera i dati sui ratei dei dipendenti del gruppo (reparto) nel periodo selezionato
 * e ne costruisce la visualizzazione riportando il riepilogo complessivo
 * 
 * @param {Number} idGroup
 * @param {Date} limitaAlGiorno
 * @param {Array<Number>} [arrDipFiltrati]
 * 
 * @properties={typeid:24,uuid:"AD318417-CE6B-4C1E-8219-E38DDAAB70D6"}
 * @AllowToRunInFind
 */
function preparaRateiReparto(idGroup,limitaAlGiorno,arrDipFiltrati)
{
	// settaggio nome form contenitore
	var oriForm = forms.rp_list_ratei_reparto_tab;
	var oriFormName = oriForm.controller.getName();
	var newFormName = oriFormName + '_temp';
	   
    // recuperiamo gli id dei dipendenti del reparto
	var al = limitaAlGiorno; 
    
    // rimozione di tabpanels precedenti
    elements.tab_ratei_reparto.removeAllTabs();
    elements.tab_ratei_reparto.transparent = false;
    
    // nel caso di un numero di lavoratori con anomalie inferiore od uguale al numero di dipendenti
    // visualizzabili in una singola pagina
	if(arrDipReparto.length <= dipPerPage)
	{
		elements.btn_last.visible = 
    	elements.btn_next.visible = 
    	elements.btn_first.visible = 
    	elements.btn_prev.visible = 
    	elements.fld_curr_page.visible = 
    	elements.lbl_pagina_di.visible = 
    	elements.lbl_totale_pagine.visible = false;
    	
		// se addirittura non vi sono lavoratori con anomalie
		if(arrDipReparto.length == 0 
		   || arrDipReparto.length == 1 && arrDipReparto[0] == null)
		{
			elements.tab_ratei_reparto.transparent = true;
	    	return;
		}
	}
	else
		elements.btn_last.visible = 
		elements.btn_next.visible = 
		elements.btn_first.visible = 
		elements.btn_prev.visible = 
		elements.fld_curr_page.visible = 
		elements.lbl_pagina_di.visible = 
		elements.lbl_totale_pagine.visible = true;
    
	// numero di pagine necessarie    
    pages = Math.ceil(arrDipReparto.length / dipPerPage);
    
    // per gestire eventuali refresh in cui il nuovo numero di pagine è minore di quello della precedente visualizzazione  
    if(pages < currPage)
    	currPage = pages >= 1 ? pages : 1;	
		
    // l'ultima pagina potrebbe avere meno dei dipendenti per pagina classici
//    var currDipPerPage = arrDipRepartolength; // OLD currPage == pages ? arrDipSquadrati.length - (currPage - 1) * dipPerPage : dipPerPage;	
    currPage == pages ? arrDipReparto.length - (currPage - 1) * dipPerPage : dipPerPage;
    
    var x=0;
    var y=0;
    var tabWidth = 640;
    var tabHeight = 135;
    var totHeight = 0;
        
    // rimozione eventuali form anomalie ditta con lo stesso nome esistenti
    if(solutionModel.getForm(newFormName))
    {
    	history.removeForm(newFormName);
    	solutionModel.removeForm(newFormName);
    }

    // codice gestione pulsanti delle pagine    
    elements.btn_last.enabled = true;
	elements.btn_next.enabled = true;
	elements.btn_first.enabled = true;
	elements.btn_prev.enabled = true;
	
    // se non vi sono dipendenti per il reparto selezionato
	if(arrDipReparto.length == 0 
	   || arrDipReparto.length == 1 && arrDipReparto[0] == null)
	{
    	elements.tab_ratei_reparto.transparent = true;
    	return;
	}
	
    // creazione della nuova form dinamica 
    var newForm = solutionModel.newForm(newFormName,solutionModel.getForm(oriFormName));
    
    var currIndex = (currPage - 1) * dipPerPage;
    var maxIndex = Math.min(currPage * dipPerPage,arrDipReparto.length);
    
    // se la ditta ha la proiezione ratei a fine anno (per il momento non visualizziamo la maturazione a fine anno)
    var _proiezioneRatei = false;//globals.getParameterValue(globals.getDitta(arrDipReparto[0]),'CRM') == 'C' ? true : false;
    
    for (var i = currIndex; i < maxIndex; i++)
    {
    	/** @type {JSFoundSet<db:/ma_anagrafiche/lavoratori>} */
    	var fs = databaseManager.getFoundSet(globals.Server.MA_ANAGRAFICHE,globals.Table.LAVORATORI);
    	if(fs.find())
    	{
    		fs.idlavoratore = arrDipReparto[i];
    		if(fs.search() == 0)
    			continue;    		
    	}
    	
    	// Dataset dei ratei per l'i-esimo dipendente
    	var dsRateiDip = globals.ottieniDataSetRateiDip(arrDipReparto[i],
    	                                                al,
														true,
														_proiezioneRatei);
    	
    	tabHeight = 50 + dsRateiDip.getMaxRowIndex() * 20;
    	totHeight += tabHeight;
    	
    	// costruzione forms tab ratei lavoratore
    	var rateiFormOri = forms.agl_ratei_tbl;
    	var rateiFormOriName = rateiFormOri.controller.getName();
    	var rateiFormName = rateiFormOriName + '_' + arrDipReparto[i];
    	    	
    	if(solutionModel.getForm(rateiFormName))
        {
        	history.removeForm(rateiFormName);
        	solutionModel.removeForm(rateiFormName);
        }
    	
        // rimozione form precedente ratei lavoratori 
        var dipFormOri = forms.rp_list_ratei_reparto_dipendente;
    	var dipFormOriName = dipFormOri.controller.getName();
    	var dipFormName = dipFormOriName + '_' + arrDipReparto[i];
    	
    	if(solutionModel.getForm(dipFormName))
        {
        	forms[dipFormName].elements.tab_ratei_dip.removeAllTabs();
        	history.removeForm(dipFormName);
        	solutionModel.removeForm(dipFormName);
        }
    	
        var tabPanelRateiDip = newForm.newTabPanel('tab_ratei_ditta_tabpanel_' + arrDipReparto[i]
                                                   ,x
		                                           ,y
		                                           ,tabWidth
		                                           ,tabHeight);
        tabPanelRateiDip.visible = true;
        tabPanelRateiDip.transparent = true;
        tabPanelRateiDip.tabOrientation = SM_ALIGNMENT.TOP;
        tabPanelRateiDip.anchors = SM_ANCHOR.NORTH | SM_ANCHOR.EAST | SM_ANCHOR.WEST | SM_ANCHOR.SOUTH;

    	var dipForm = solutionModel.cloneForm(dipFormName
    	                                      ,solutionModel.getForm(dipFormOriName));
    	
    	var tabRateiDipHeader = fs.codice + ' - ' + fs.lavoratori_to_persone.nominativo;
    	tabPanelRateiDip.newTab('tab_ratei_dip_' + arrDipReparto[i],tabRateiDipHeader,dipForm);
    	    	
 	   	y += tabHeight;									  
    	 	   	
 	    if(dsRateiDip.getMaxRowIndex() == 0)
 	    	continue;
 	    	
 	   /** @type {Number}*/
	   	var idLavoratore = arrDipReparto[i];
	   	var currFrmName = 'rp_list_ratei_reparto_dipendente_' + idLavoratore;
	   	/** @type {Form<rp_list_ratei_reparto_dipendente>} */
	   	var currFrm = forms[currFrmName];
	 	    currFrm.preparaSituazioneRateiLavoratore(idLavoratore,al,_proiezioneRatei);
	 	    
    }
    
    solutionModel.getForm(newFormName).getBodyPart().height = totHeight;//tabHeight * arrDipSquadrati.length;
    
    elements.tab_ratei_reparto.addTab(newFormName,newFormName);
        
//  gestione delle pagine    
    if(currPage == pages)
    {
    	elements.btn_last.enabled = false;
    	elements.btn_next.enabled = false;
    }
    if(currPage == 1)
    {
    	elements.btn_first.enabled = false;
    	elements.btn_prev.enabled = false;
    }
    
}

/**
 * Prepara il riepilogo dei dati per la situazione dei ratei del reparto alla data selezionata
 * 
 * @param {Array<Number>} arrLavoratori
 * @param {Date} al
 *
 * @properties={typeid:24,uuid:"295FB9F8-2630-4B7B-99FD-0C8022DC7BF9"}
 * @SuppressWarnings(unused)
 */
function preparaSituazioneRateiReparto(arrLavoratori,al)
{	    
	if(elements.tab_ratei_reparto_riepilogo)
	   elements.tab_ratei_reparto_riepilogo.removeAllTabs();
	
	if(arrLavoratori.length == 0
	   || arrLavoratori.length == 1 && arrLavoratori[0] == null)
	{
		elements.tab_ratei_reparto_riepilogo.transparent = true;
	    return;
	}
	
	var _vFormName = controller.getName() + '_' + vOptGruppoId;
	var vDatasetRateiReparto = globals.ottieniDataSetRateiReparto(arrLavoratori,
    	                                                          al,
								    						      true);    
    var vDataSourceRateiReparto = vDatasetRateiReparto.createDataSource('vDataSourceRateiReparto_' + vOptGruppoId);
	
	if(history.removeForm(_vFormName))	
       solutionModel.removeForm(_vFormName);
	
	solutionModel.cloneForm(_vFormName, solutionModel.getForm('agl_ratei_tbl'));
	solutionModel.getForm(_vFormName).styleName = 'leaf_style_table';
	solutionModel.getForm(_vFormName).dataSource = vDataSourceRateiReparto;
    solutionModel.getForm(_vFormName).getField('descrizione').dataProviderID = 'Descrizione';
    solutionModel.getForm(_vFormName).getField('anni_precedenti').dataProviderID = 'Residuo2AP';
    solutionModel.getForm(_vFormName).getField('residuo_iniziale').dataProviderID = 'ResiduoAnnoPrec';
    solutionModel.getForm(_vFormName).getField('maturato_anno').dataProviderID = 'MaturatoAnno';
    solutionModel.getForm(_vFormName).getField('accantonate').dataProviderID = 'Accantonate';
    solutionModel.getForm(_vFormName).getField('goduto_anno').dataProviderID = 'GodutoAnno';
    solutionModel.getForm(_vFormName).getField('liquidato_anno').dataProviderID = 'LiquidatoAnno';	
    solutionModel.getForm(_vFormName).getField('residuo').dataProviderID = 'Residuo';
    
    forms[_vFormName].elements['damaturare'].visible =
    forms[_vFormName].elements['residuofinematurazione'].visible =
    forms[_vFormName].elements['periodofinematurazione'].visible = false;
    
 	elements.tab_ratei_reparto_riepilogo.addTab(_vFormName);
	    	
}

/**
 * Callback method for when form is shown.
 *
 * @param {Boolean} firstShow form is shown first time after load
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"1DFBF3D1-F429-45C7-82B9-8DC3E20C547E"}
 */
function onShow(firstShow, event) 
{
	plugins.busy.prepare();
	
	if(firstShow)
	{
		var arrDitteStd = globals.getDitteStandard();
		var maxPeriodoUltimoCedolino = 201301;
		if(arrDitteStd.length == 0)
		   maxPeriodoUltimoCedolino = globals.ma_utl_dateToPeriodo(globals.TODAY);
		else
		{
			for(var d = 0; d < arrDitteStd.length; d++)
			{
				var periodoUltimoCedolino = globals.ma_utl_getUltimoCedolinoStampato(globals.convert_DitteCliente2Sede(idditta));
				if(maxPeriodoUltimoCedolino < periodoUltimoCedolino)
					maxPeriodoUltimoCedolino = periodoUltimoCedolino;
			}
		}
		
		limitaAl = globals.getLastDatePeriodo(maxPeriodoUltimoCedolino);
		
		var realValues = new Array();
		var displayValues = new Array();
		
		var dsUserGroup = globals.ma_sec_getUserGroups(globals.svy_sec_lgn_organization_id,globals.svy_sec_lgn_user_id);
		if (dsUserGroup && dsUserGroup.getMaxRowIndex() > 0)
		{
			realValues[0] = -1;
			displayValues[0] = '';
				
			realValues = realValues.concat(dsUserGroup.getColumnAsArray(1));
			displayValues = displayValues.concat(dsUserGroup.getColumnAsArray(2));
				
		}
		
		application.setValueListItems('vls_ma_sec_groups', displayValues, realValues);
		
		var dsSecGroups = application.getValueListItems('vls_ma_sec_groups');
		if(dsSecGroups.getMaxRowIndex() == 1)
			vOptGruppoId = parseInt(dsSecGroups.getValue(2,2),10);
		else
			vOptGruppoId = -1;
	}
	controller.readOnly = false;
	
	refreshRateiReparto();
	
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"9FF26622-22E8-4432-ADB1-A22A1BFAA1DE"}
 */
function onActionFirst(event)
{
	currPage = 1;
	preparaRateiReparto(vOptGruppoId,limitaAl);
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"D5EE02A2-4F5F-4473-9BC3-5AF85D568609"}
 */
function onActionLast(event) 
{
	currPage = pages; 
	preparaRateiReparto(vOptGruppoId,limitaAl);
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"9F347EDB-537E-47DC-9CEB-965033729F11"}
 */
function onActionPrev(event) 
{
	--currPage;
	preparaRateiReparto(vOptGruppoId,limitaAl);
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"1AECD268-5B62-4C42-9A74-D192C9DD982E"}
 */
function onActionNext(event)
{
	currPage++;
	preparaRateiReparto(vOptGruppoId,limitaAl);
}

/**
 * Handle changed data.
 *
 * @param oldValue old value
 * @param newValue new value
 * @param {JSEvent} event the event that triggered the action
 *
 * @returns {Boolean}
 *
 * @private
 *
 * @properties={typeid:24,uuid:"86220145-A694-4D3A-BF44-3F3636A7B727"}
 */
function onDataChangePage(oldValue, newValue, event) {
	
	if(newValue > 0 && newValue <= pages)
	{
		preparaRateiReparto(vOptGruppoId,limitaAl);
		return true;
	}
	
	return false;
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"37CF4141-5CD7-4E29-B749-BFD80F4B88C5"}
 */
function onActionRefresh(event) 
{
	var params = {
        processFunction: process_refresh_ratei_reparto,
        message: '', 
        opacity: 0.2,
        paneColor: '#434343',
        textColor: '#EC1C24',
        showCancelButton: false,
        cancelButtonText: '',
        dialogName : '',
        fontType: 'Arial,4,35',
        processArgs: []
    };
	plugins.busy.block(params);
}

/**
 * @properties={typeid:24,uuid:"767CACDA-AEBC-4CEE-92A5-773E84EC62D3"}
 */
function process_refresh_ratei_reparto()
{
	try
	{
		refreshRateiReparto();	
	}
	catch(ex)
	{
		var msg = 'Metodo process_refresh_ratei_reparto : ' + ex.message;
		globals.ma_utl_showErrorDialog(msg)
		globals.ma_utl_logError(msg,LOGGINGLEVEL.ERROR);
	}
	finally
	{
		plugins.busy.unblock();
	}
}

/**
 * @properties={typeid:24,uuid:"6B631BCC-E717-44EE-88C8-3D802118EB32"}
 */
function refreshRateiReparto()
{
	arrDipReparto = [];
	
	if(vOptGruppoId != -1)
	   arrDipReparto = globals.getLavoratoriReparto(vOptGruppoId);
	else
	{
		if(_to_sec_user$user_id.sec_user_to_sec_user_to_lavoratori)
			arrDipReparto.push(arrDipReparto.push(_to_sec_user$user_id.sec_user_to_sec_user_to_lavoratori.idlavoratore));
	
		var arrDipRepartoTmp = globals.getUserHierarchy(globals.svy_sec_lgn_user_org_id, globals.ma_sec_lgn_groupid, true);
		for(var d = 0; d < arrDipRepartoTmp.length; d++)
		{
			if(arrDipRepartoTmp[d] != null)
				arrDipReparto.push(arrDipRepartoTmp[d]);
		}
	}
		
	preparaRateiReparto(vOptGruppoId, limitaAl);
	preparaSituazioneRateiReparto(arrDipReparto,limitaAl);
}

/**
 * @properties={typeid:24,uuid:"4943FD72-D657-4F3C-AC5E-E8421640322B"}
 */
function goToEditRateiReparto()
{
	globals.ma_utl_setStatus(globals.Status.EDIT,controller.getName());
}

/**
 * @properties={typeid:24,uuid:"F2513922-D3A1-4D15-80DB-BB723761EE33"}
 */
function goToBrowseRateiReparto()
{
	globals.ma_utl_setStatus(globals.Status.BROWSE,controller.getName());
}

/**
 * Handle changed data.
 *
 * @param {Date} oldValue old value
 * @param {Date} newValue new value
 * @param {JSEvent} event the event that triggered the action
 *
 * @returns {Boolean}
 *
 * @private
 *
 * @properties={typeid:24,uuid:"40AD4FA0-C66D-4D16-BD5A-BE15BD2B72FD"}
 */
function onDataChangeData(oldValue, newValue, event) 
{
	var frm = forms.svy_nav_fr_openTabs;
	if(frm.vSelectedTab != null 
			&& globals.objGiornParams[frm.vTabNames[frm.vSelectedTab]])
	{
		var inizioMese = new Date(annoRif,meseRif - 1,1);
		var fineMese = new Date(annoRif,meseRif - 1,globals.getTotGiorniMese(meseRif,annoRif));
		if(newValue < inizioMese || newValue > fineMese)
		    return false;
		
		if(event.getElementName() == 'fld_dal')
		    globals.objGiornParams[frm.vTabNames[frm.vSelectedTab]].dal = newValue;
		else
			globals.objGiornParams[frm.vTabNames[frm.vSelectedTab]].al = newValue;
	}
	return true;
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"E9B333A2-A930-45CE-9DAB-F3E7FE83F14B"}
 */
function onActionPrintSituazioneRateiReparto(event) 
{
	if(arrDipReparto.length == 0)
	{
		globals.ma_utl_showWarningDialog('Nessun dipendente nella selezione corrente','Stampa situazione ratei reparto');
	    return;
	}
	
	var params = {
        processFunction: process_stampa_situazione_ratei_reparto,
        message: '', 
        opacity: 0.5,
        paneColor: '#434343',
        textColor: '#EC1C24',
        showCancelButton: false,
        cancelButtonText: '',
        dialogName : '',
        fontType: 'Arial,4,35',
        processArgs: []
    };
	plugins.busy.block(params);
}

/**
 * @properties={typeid:24,uuid:"B42A04C8-4180-43CA-B0A1-1BB7849F37C3"}
 */
function process_stampa_situazione_ratei_reparto()
{
	try
	{
		var params = new Object();
		params['idditta'] = globals.getDitta(arrDipReparto[0]);
		params['iddipendenti'] = arrDipReparto;
		params['alladata'] = utils.dateFormat(limitaAl,globals.EU_DATEFORMAT);
		params['daticontrattuali'] = 1;
		params['codicirateoselezionati'] = [];
		params['periodo'] = limitaAl.getFullYear() * 100 + limitaAl.getMonth() + 1; 
		params['bExcel'] = 0;
		params['groupContratto'] = false;
		params['groupQualifica'] = false;
		params['groupPosizioneInps'] = false;
		params['groupSedeLavoro'] = false;
		params['groupRaggruppamento'] = false;
		params['groupTipoRaggruppamento'] = 0;
	
	    var url = globals.WS_MULTI_URL + "/Stampe/StampaSituazioneRatei";
	    globals.addJsonWebServiceJob(url, params);
	}
	catch(ex)
	{
		var msg = 'Metodo process_stampa_situazione_ratei_reparto : ' + ex.message;
		globals.ma_utl_showErrorDialog(msg)
		globals.ma_utl_logError(msg,LOGGINGLEVEL.ERROR);
	}
	finally
	{
		plugins.busy.unblock();
	}
}
