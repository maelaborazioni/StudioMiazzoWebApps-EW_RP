/**
 * @type {Date}
 *
 * @properties={typeid:35,uuid:"CF09B08D-1DCD-4A9D-819B-9942EE6B8D37",variableType:93}
 */
var vDal;

/**
 * @type {Date}
 *
 * @properties={typeid:35,uuid:"5314B523-9867-48F3-BC72-B22F41F44353",variableType:93}
 */
var vAl;

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"53F74C64-8010-4EF0-B0C1-D80F5457EE08"}
 */
var vNote = '';

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"A978D190-0A42-4DBE-8F1F-F58DE8438A35",variableType:8}
 */
var vIdLavoratore;

/**
 * @type {Date}
 *
 * @properties={typeid:35,uuid:"0C7FF029-29DD-456B-8283-D234321ADB5F",variableType:93}
 */
var vDataRichiesta;

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"6D600D54-5BE0-4843-98E1-7C0963DB2774"}
 */
var vIdEvento = '';

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"E02A05E6-9CD3-4BF9-8BF3-4A1D1A98D384"}
 */
var vCodProp = '';

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"3D745727-5378-44E5-9D98-AB5E434BA762"}
 */
var vOre = '';

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"A3C93BFD-6504-43C2-91D8-84FC07D4CE2F"}
 */
var vImporto = '';

/**
 * @type {Boolean}
 *
 * @properties={typeid:35,uuid:"0DB3E28F-5EFD-40C4-BF69-B0F956CFAF89",variableType:-4}
 */
var vIsGestore = false;

/**
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"2A454421-2044-4CAE-A23E-F36D2BA76532"}
 */
function refreshCalendario(event)
{
	var params = {
        processFunction: process_refresh_calendario,
        message: '', 
        opacity: 0.5,
        paneColor: '#434343',
        textColor: '#EC1C24',
        showCancelButton: false,
        cancelButtonText: '',
        dialogName : '',
        fontType: 'Arial,4,25',
        processArgs: [event]
    };
	plugins.busy.block(params);
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"0EC135BC-3E79-4A32-98F6-FF5EE2686CFB"}
 * @SuppressWarnings(unused)
 * @AllowToRunInFind
 */
function process_refresh_calendario(event) {
	try
	{
		if (vDal == null) throw new Error('Specificare il giorno iniziale della richiesta');
		if (vAl < vDal) throw new Error('L\'ultimo giorno della richiesta non può essere inferiore al primo');
		
		elements.btn_reload.enabled = true;
	
		var frmName = 'rp_richiesta_permessi_tbl';
		var frmNameTemp = 'rp_richiesta_permessi_tbl_temp';
	
		forms[event.getFormName()].elements.tab_dtl.removeAllTabs();
	
		if (forms[frmNameTemp] != null) {
			history.removeForm(frmNameTemp);
			solutionModel.removeForm(frmNameTemp);
		}
	
		var tempForm = solutionModel.cloneForm(frmNameTemp, solutionModel.getForm(frmName));
		tempForm.scrollbars = SM_SCROLLBAR.SCROLLBARS_WHEN_NEEDED;
	
		var types = [JSColumn.DATETIME, JSColumn.NUMBER, JSColumn.DATETIME, JSColumn.DATETIME, JSColumn.TEXT, JSColumn.TEXT, JSColumn.TEXT, JSColumn.NUMBER];
		var columns = ['Giorno', 'Intero', 'DalleOre', 'AlleOre', 'IdEvento', 'CodiceProprieta', 'DescEvento', 'OreEvento'];
		var rows = Math.floor( (vAl - vDal) / 86400000) + 1;
		var dsRic = databaseManager.createEmptyDataSet(0, columns);
	
		// se la ditta utilizza il criterio di smaltimento inseriremo l'evento PD altrimenti l'evento F
		var usaSmaltimento = globals.utilizzaSmaltimentoRatei(globals.getDitta(vIdLavoratore));
	
		var error = false;
		var errorMessage = 'La fascia dei giorni seguenti è stata forzata:<p>';
	
		// controllo limite temporale
		switch (globals.getParameterValue(globals.getDitta(vIdLavoratore), 'LTR')) {
		case 'DSGR':
			if (globals.TODAY >= vDal) throw new Error('La data della richiesta non può essere uguale o precedente alla data in cui viene effettuata');
			break;
		case 'DUSGR':
			if (globals.TODAY > vDal) throw new Error('La data della richiesta non può essere precedente alla data in cui viene effettuata');
			break;
		default:
			break;
		}
	
		// filtraggio eventi effettivamente selezionabili per il lavoratore richiesto
		globals.FiltraEventiSelezionabili(vIdLavoratore,
										  vDal.getFullYear() * 100 + vDal.getMonth() + 1,
										  globals.TipoGiornaliera.BUDGET);
	
		globals.FiltraEventiSelezionabiliModulo(vIdLavoratore, 
			                                    globals.CategoriaSW.RFP);
	
		/** @type {Array<Number>}*/
		var arrIdEventiEffettivi = [];
	
		for (var e = 0; e < globals._arrIdEvSelezionabiliRP.length; e++) {
			if (globals._arrIdEvSelezionabili.indexOf(globals._arrIdEvSelezionabiliRP[e]) != -1)
				arrIdEventiEffettivi.push(globals._arrIdEvSelezionabiliRP[e]);
		}
	
		if (arrIdEventiEffettivi.length == 0) throw new Error('Nessun evento selezionabile per la richiesta');
	
		var eventiAZeroOre = globals.haEventiAZeroOre(arrIdEventiEffettivi);
		
		/** type {Array<Number>} */
		var arrPeriodi = [];
		for(var gg = vDal; gg <= vAl; gg = new Date(gg.getFullYear(),gg.getMonth(),gg.getDate() + 1))
		{
			var currPeriodo = gg.getFullYear() * 100 + gg.getMonth() + 1;
			if(arrPeriodi.indexOf(currPeriodo) == -1)
				arrPeriodi.push(currPeriodo);
		}
		
		var idDitta = globals.getDitta(vIdLavoratore);
		var arrFestDip = [];
		for(var p = 0; p < arrPeriodi.length; p++)
		{
			var url = globals.WS_RFP_URL + "/Trattamenti/RiepilogoFestivitaDittaPeriodoLavoratori";
			var par = {
				tipoconnessione : globals.TipoConnessione.CLIENTE,
				databasecliente : globals.customer_dbserver_name,
				periodo : arrPeriodi[p],
				idditta : idDitta,
				iddipendenti : [],
				gruppolavoratori : ''
				};
			/** @type {{ returnValue: Boolean, riepilogoFestivita: Array<Array> }} */
			var response = globals.getWebServiceResponse(url, par);
			var arrRiepFestivita = response.riepilogoFestivita;
		    
			for(var f = 0; f < arrRiepFestivita.length; f++)
	        {   
	    	   if(arrRiepFestivita[f])
	           {
	        	   //  visualizziamo solamente le festività non accantonate che concorrono all'orario di riferimento
	        	   var festivita = false;
	    	       var vArrFesta = arrRiepFestivita[f][2];
	    		   for(var j = 0; j < vArrFesta.length; j++)
	    		   {
	        		   if(utils.stringLeft(vArrFesta[j][2],2) != "FA")
	        			   festivita = true;
	        	   } 
	        	           	   
	        	   if(festivita && arrFestDip.indexOf(arrRiepFestivita[f][0]) == -1)
	       	          arrFestDip.push(arrRiepFestivita[f][0]);
	       	   }
	        }
			
//			var arrFestDipPeriodo = globals.getFestivitaDipendente(globals.getDitta(vIdLavoratore),vIdLavoratore,arrPeriodi[p]);
//			for(var afdp = 0; afdp < arrFestDipPeriodo.length; afdp++)
//			{
//				var fest = utils.stringTrim(arrPeriodi[p] * 100 + arrFestDipPeriodo[afdp]);
//				if(arrFestDip.indexOf(fest) == -1)
//					arrFestDip.push(fest);
//			}
		}
				
		// ciclo sui giorni del periodo indicato in richiesta
		for (var i = 1; i <= rows; i++) {
			var g = vDal;
			g.setDate(vDal.getDate() + i - 1)
	
			var arr;
			// per i giorni (teoricamente al momento della richiesta) lavorativi e non festivi aggiungiamo una riga al dataset provvisorio
			if (arrFestDip.indexOf(globals.dateFormat(g,globals.ISO_DATEFORMAT)) == -1)
			{
				var infoFascia = globals.ottieniInformazioniFasciaGiorno(vIdLavoratore,g);		

				if(infoFascia.totaleorefascia > 0 || eventiAZeroOre)
				{
					arr = [g
					, 1
					, null
					, null
					, arrIdEventiEffettivi.length == 1 ? arrIdEventiEffettivi[0] : null
					, null
					, arrIdEventiEffettivi.length == 1 ? globals.getCodiceEvento(arrIdEventiEffettivi[0]) + ' - ' + globals.getDescrizioneEvento(arrIdEventiEffettivi[0]) : null
					, null];
				
					dsRic.addRow(arr);
				}
			
			}
		}
		if (error) 
			throw new Error(errorMessage + '</p><p>Non è possibile inserire richieste in fascia forzata, utilizzare lo strumento <strong>Programmazione turni</strong> per impostare la fascia corretta, quindi riprovare.</p>');
		
		// se non esistono giornate lavorative per i giorni del periodo indicato
		if (dsRic.getMaxRowIndex() == 0) 
			throw new Error('Non esistono giornate lavorative per le quali richiedere ferie o permessi nel periodo indicato', 'Inserimento nuova richiesta');
		
		var dSRic = dsRic.createDataSource('dSRic', types);
	
		solutionModel.getForm(frmNameTemp).dataSource = dSRic;
		solutionModel.getForm(frmNameTemp).getField('fld_giorno').dataProviderID = 'giorno';
		solutionModel.getForm(frmNameTemp).getField('fld_stato').dataProviderID = 'intero';
		solutionModel.getForm(frmNameTemp).getField('fld_dalle_ore').dataProviderID = 'dalleore';
		solutionModel.getForm(frmNameTemp).getField('fld_alle_ore').dataProviderID = 'alleore';
		solutionModel.getForm(frmNameTemp).getField('fld_id_evento').dataProviderID = 'idevento';
		solutionModel.getForm(frmNameTemp).getField('fld_codice_proprieta').dataProviderID = 'codiceproprieta';
		solutionModel.getForm(frmNameTemp).getField('fld_desc_evento').dataProviderID = 'descevento';
		solutionModel.getForm(frmNameTemp).getField('fld_ore_evento').dataProviderID = 'oreevento';
	
		solutionModel.getForm(frmNameTemp).getLabel('btn_ric_evento').visible = (arrIdEventiEffettivi.length > 1);
	
		if (dsRic.getMaxRowIndex() > 1) {
			solutionModel.getForm(frmNameTemp).getField('fld_stato').enabled = solutionModel.getForm(frmNameTemp).getField('fld_dalle_ore').enabled = solutionModel.getForm(frmNameTemp).getField('fld_alle_ore').enabled = false;
	
			solutionModel.getForm(frmNameTemp).getField('fld_stato').toolTipText = solutionModel.getForm(frmNameTemp).getField('fld_dalle_ore').toolTipText = solutionModel.getForm(frmNameTemp).getField('fld_alle_ore').toolTipText = 'Per una selezione di più giorni si possono effettuare solo richieste sull\'intero giorno';
		}
	
		forms[event.getFormName()].elements.tab_dtl.addTab(frmNameTemp);
	
		globals.ma_utl_setStatus(globals.Status.EDIT, frmNameTemp);

	}
	catch(ex)
	{
		databaseManager.rollbackTransaction();
		globals.ma_utl_showErrorDialog(ex.message,'Inserimento nuova richiesta');
	}
	finally
	{
		plugins.busy.unblock();
	}
	
	return true;
}

/**
 * @param {JSFoundset} fs
 *
 * @return {Boolean}
 *
 * @properties={typeid:24,uuid:"612BD966-24DB-4150-B5AA-80A71D3A4B2C"}
 */
function validaRichiesta(fs)
{
	var arrEventiDaAutorizzare = [];
	var numGiorni = fs.getSize();

	if (numGiorni == 0) {
		globals.ma_utl_showWarningDialog(globals.getHtmlString('Specificare i <b>giorni</b> per la richiesta e compilare il <b>calendario</b> prima di proseguire'), 'Validazione richiesta permessi');
		return false;
	}

	// controllo assunzione/cessazione
	/** @type {Date}*/
	var primoGiornoRichiesta = fs.getRecord(1)['giorno'];
	/** @type {Date}*/
	var ultimoGiornoRichiesta = fs.getRecord(numGiorni)['giorno'];
	var assunzione = globals.getDataAssunzione(vIdLavoratore);
	var cessazione = globals.getDataCessazione(vIdLavoratore);
	if(primoGiornoRichiesta < assunzione) 
	{
		globals.ma_utl_showWarningDialog(globals.getHtmlString('Il dipendente non risulta ancora assunto alla data della richiesta'), 'Validazione richiesta permessi');
		return false;
	}
	
	if(cessazione != null && ultimoGiornoRichiesta > cessazione)
	{
		globals.ma_utl_showWarningDialog(globals.getHtmlString('Il dipendente risulta già cessato alla data della richiesta'), 'Validazione richiesta permessi');
		return false;
	}
	
	// controllo festività caso Programmazione Negozio
	if(globals.ma_utl_hasKey(globals.Key.NEGOZIO))
	{
		var festivita = [];
		var periodoIni = primoGiornoRichiesta.getFullYear() * 100 + primoGiornoRichiesta.getMonth() + 1;
		var periodoFin = ultimoGiornoRichiesta.getFullYear() * 100 + ultimoGiornoRichiesta.getMonth() + 1;
		var festivitaIni = globals.getFestivitaDipendente(globals.getDitta(vIdLavoratore),vIdLavoratore,periodoIni);
		for(var f = 0; f < festivitaIni.length; f++)
			festivita.push('' + (periodoIni * 100  + festivitaIni[f]) + '');
		
		if(periodoIni != periodoFin)
		{
			var festivitaFin = globals.getFestivitaDipendente(globals.getDitta(vIdLavoratore),vIdLavoratore,periodoFin);
			for(f = 0; f < festivitaFin.length; f++)
				festivita.push('' + (periodoFin * 100 + festivitaFin[f]) + ''); 
		}
				
	}
	
	for (var i = 1; i <= numGiorni; i++) {
		var rec = fs.getRecord(i);

		// controllo caso Programmazione Negozio
		if(globals.ma_utl_hasKey(globals.Key.NEGOZIO))
		{
			// se esiste già una fascia programmata nel giorno (a parte nel caso di festività), non possono essere fatte richieste
			var recFasciaProg = scopes.giornaliera.getProgrammazioneFasceGiorno(vIdLavoratore,rec['giorno']);
			if(recFasciaProg != null && festivita.indexOf(globals.dateFormat(rec['giorno'],globals.ISO_DATEFORMAT)) == -1)
			{
				globals.ma_utl_showWarningDialog(globals.getHtmlString('Esistono delle fasce precedentemente programmate per i giorni richiesti, non è possibile inserire la richiesta'), 'Validazione richiesta permessi');
				return false;
			}
		}
		
		// tipologia autorizzazione dell'evento
		var tipoAutorizzazioneEvento = globals.isEventoDaAutorizzare(globals.getDitta(vIdLavoratore), rec['idevento']);
		arrEventiDaAutorizzare.push([rec['idevento'], tipoAutorizzazioneEvento]);

		// ottenimento informazioni sulla fascia per verifica orari inseriti
		var objInfoFascia = globals.ottieniInformazioniFasciaGiorno(vIdLavoratore, rec['giorno']);

		// controllo giornata di riposo
		//		if(!objInfoFascia['inizioorario'] && !objInfoFascia['fineorario'])
		//		{
		//			globals.ma_utl_showWarningDialog('Non è possibile inserire un permesso per la giornata indicata', 'Richiesta ferie e permessi');
		//			return false;
		//		}
		// controllo se la tipologia di evento è stata indicata
		if (rec['idevento'] == null 
				&& objInfoFascia['totaleorefascia'] != 0) 
		{
			globals.ma_utl_showWarningDialog(globals.getHtmlString('Specificare <b>tutti</b> gli <b>eventi</b> da inserire per i giorni richiesti'), 'Validazione richiesta permessi');
			return false;
		}
		
		// controllo caso di giorno con fascia a zero 
		if (objInfoFascia['totaleorefascia'] == 0)
		{
			if(!globals.isEventoAZeroOre(rec['idevento']))
			{
				globals.ma_utl_showWarningDialog(globals.getHtmlString('Nel giorno ' + globals.dateFormat(rec['giorno'],globals.EU_DATEFORMAT) + ' può essere inserito solamente un evento consentito a zero ore'), 'Validazione richiesta permessi');
				return false;
			}
			else if(!rec['intero'])
			{
				globals.ma_utl_showWarningDialog(globals.getHtmlString('Nel giorno ' + globals.dateFormat(rec['giorno'],globals.EU_DATEFORMAT) + ' può essere inserito solamente un evento consentito a zero ore e non possono essere inseriti degli orari di inizio e fine, solamente il giorno intero'), 'Validazione richiesta permessi');
				return false;
			}
		}
		
		// controlli nel caso di giorno non intero
		if (!rec['intero']) {
			var _dalleOre = rec['dalleore'].getHours() * 100 + rec['dalleore'].getMinutes();
			var _alleOre = rec['alleore'].getHours() * 100 + rec['alleore'].getMinutes();

			// controllo inserimento ora di partenza e ora di fine richiesta
			if (!rec['dalleore'] || !rec['alleore']) {
				globals.ma_utl_showWarningDialog('Inserire entrambi gli orari di partenza e termine permesso per il giorno ' + globals.dateFormat(rec['giorno'],globals.EU_DATEFORMAT), 'Richiesta ferie e permessi');
				return false;
			}
			// gestione fasce con orario notturno
			if (objInfoFascia['fineorario'] < objInfoFascia['inizioorario']) {
				if (_dalleOre < objInfoFascia['fineorario'])
					_dalleOre += 2400;
				objInfoFascia['fineorario'] += 2400;
				_alleOre += 2400;
			}
			// controllo orario di inizio / orario di fine
			if (objInfoFascia['fineorario'] <= 2400 && rec['dalleore'] >= rec['alleore']) {
				globals.ma_utl_showWarningDialog(globals.getHtmlString('Nel giorno ' + globals.dateFormat(rec['giorno'],globals.EU_DATEFORMAT) + 'l\'<b>orario iniziale</b> del permesso richiesto non può superare quello <b>finale</b> od essere il medesimo'), 'Validazione richiesta permessi');
				return false;
			}
			// controllo formato orario inserito (a quarti d'ora o a mezzora a seconda del parametro scelto)
			else {
				var m30 = null;
				switch (globals.getParameterValue(globals.getDitta(vIdLavoratore), 'MIO')) {
				case 'M15':
					m30 = false;
					break;
				case 'M30':
					m30 = true;
					break;
				default:
					break;
				}
				if (!globals.validaOrarioInserito(rec['dalleore'], m30) || !globals.validaOrarioInserito(rec['alleore'], m30)) {
					globals.ma_utl_showWarningDialog('Verifica che nel giorno ' + globals.dateFormat(rec['giorno'],globals.EU_DATEFORMAT) +' l\'orario inserito sia conforme alla gestione orari della ditta', 'Richiesta ferie e permessi');
					return false;
				}
			}

			switch (globals.getParameterValue(globals.getDitta(vIdLavoratore), 'MCO')) {
			case 'SF': // di default si effettuano i controlli sulla fascia associate al giorno
				// controllo fine orario non supera orario teorico massimo
				if (objInfoFascia['fineorario'] && _alleOre > objInfoFascia['fineorario']) {
					globals.ma_utl_showWarningDialog('i18n:ma.msg.rp_alleore', 'Richiesta ferie e permessi');
					return false;
				}
				// controllo inizio orario non è precedente all'orario teorico minimo
				if (objInfoFascia['inizioorario'] && _dalleOre < objInfoFascia['inizioorario']) {
					globals.ma_utl_showWarningDialog('i18n:ma.msg.rp_dalleore', 'Richiesta ferie e permessi');
					return false;
				}
				break;
			case 'D': // altrimenti il calcolo è diretto
				break;
			default:
				break;
			}

			if (objInfoFascia['totaleorefascia'] < globals.calcolaOreEvento(_dalleOre,
				_alleOre,
				objInfoFascia['inizioorario'],
				objInfoFascia['iniziopausa'],
				objInfoFascia['finepausa'],
				objInfoFascia['fineorario'],
				objInfoFascia['totaleorefascia'],
				objInfoFascia['totaleorepausa'])) {
				globals.ma_utl_showWarningDialog('Nel giorno ' + globals.dateFormat(rec['giorno'],globals.EU_DATEFORMAT) +' l\'orario inserito è superiore al totale di ore della fascia teorica', 'Richiesta ferie e permessi');
				return false;
			}

		}
	}

	// controllo ulteriore per verificare se gli eventi sono tutti della stessa tipologia
	var tipologiaEventiSelezionati;
	for (var ea = 0; ea < arrEventiDaAutorizzare.length; ea++) {
		var elem = arrEventiDaAutorizzare[ea];
		if (ea == 0)
			tipologiaEventiSelezionati = elem[1];
		else {
			if (tipologiaEventiSelezionati != elem[1]) {
				globals.ma_utl_showWarningDialog('I diversi eventi selezionati hanno modalità di autorizzazione differente, richiederli separatamente', 'Richiesta ferie e permessi');
				return false;
			}
		}
	}

	return true;
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"3DCE3E43-CBC8-4028-B07B-C645C28097E3"}
 * @AllowToRunInFind
 */
function confermaNuovaRichiesta(event) {

	//gestione dell'inserimento della richiesta nel database
	var frmName = 'rp_richiesta_permessi_tbl_temp';
	var frm = forms[frmName];

	if (!frm) 
	{
		databaseManager.rollbackTransaction();
		globals.ma_utl_showWarningDialog('Cliccare sul pulsante di generazione giorni e compilare i dati prima di proseguire','Validazione richiesta permessi');
		return false;
	}

	var fs = frm.foundset;

	if (validaRichiesta(fs)) {
		var params = {
			processFunction: process_richiesta_permessi,
			message: '',
			opacity: 0.5,
			paneColor: '#434343',
			textColor: '#EC1C24',
			showCancelButton: false,
			cancelButtonText: '',
			dialogName: 'This is the dialog',
			fontType: 'Arial,4,25',
			processArgs: [event, fs]
		};
		plugins.busy.block(params);

	}
	return true;
}

/**
 * @AllowToRunInFind
 *
 * @param {JSEvent} event
 * @param {JSFoundset} fs
 *
 * @properties={typeid:24,uuid:"53D34A07-8F86-419C-A311-2B69CB5B2DF2"}
 */
function process_richiesta_permessi(event, fs) 
{
	try 
	{
		var numGiorni = fs.getSize();
		
		// verifica richieste precedenti già inserite
		var bloccaInserimento = false;
		var msg = "Esistono le seguenti richieste già inserite per il dipendente nei giorni indicati: <br/>"
		/** @type {JSFoundset<db:/ma_anagrafiche/lavoratori_giustificativirighe>}*/
		var fsPrec = globals.ottieniRichiesteDalAl(vIdLavoratore, vDal, vAl);
		if (fsPrec) {
			for (var g = 1; g <= fsPrec.getSize(); g++) {
				fsPrec.setSelectedIndex(g);
				switch (fsPrec.lavoratori_giustificativirighe_to_lavoratori_giustificativitesta.stato) {
				case null:
					// caso richiesta in attesa (quindi inserita dal dipendente, il blocco c'è nel caso
					// la richiesta sia riferita all'intera giornata)
					msg += 'IN ATTESA';
					if (!vIsGestore && fsPrec.ore == 0)
						bloccaInserimento = true;
					break;
				case 1:
					// caso richiesta già confermata (se la richiesta è per tutta la giornata c'è il blocco sia
					// che sia stata inserita dal gestore sia dal dipendente)
					msg += 'CONFERMATA';
					if (fsPrec.ore == 0)
						bloccaInserimento = true;
					break;
				case 2:
					// caso richiesta rifiutata (nessun blocco)
					msg += 'RIFIUTATA';
					break;
				default:
					break;
				}
				msg += " - il giorno " + globals.getNumGiorno(fsPrec.giorno) + ' ' + globals.getNomeMese(fsPrec.giorno.getMonth() + 1);
				msg += " l\'evento " + fsPrec.lavoratori_giustificativirighe_to_e2eventi.evento_descrizione;
				msg += fsPrec.ore != 0 ? " , ore " + fsPrec.ore : ' per l\'intera giornata';
				//	msg += " inserita il giorno " + fsPrec.lavoratori_giustificativirighe_to_lavoratori_giustificativitesta.datarichiesta
				//	msg += " e approvata dall\'utente " + fsPrec.lavoratori_giustificativirighe_to_lavoratori_giustificativitesta.approvatoda;
				msg += "<br/>"
			}

			if (bloccaInserimento) {
				plugins.busy.unblock();
				globals.ma_utl_showWarningDialog(msg, 'Verifica richiesta già inserite');
				return false;
			} else {
				msg += "Procedere comunque?";
				var answer = globals.ma_utl_showYesNoQuestion(msg, 'Verifica richieste già inserite');
				if (!answer) {
					plugins.busy.unblock();
					return false;
				}
			}
		}
		
		databaseManager.startTransaction();
		
		/** @type {JSFoundset<db:/ma_anagrafiche/lavoratori>}*/
		var fsLav = databaseManager.getFoundSet(globals.Server.MA_ANAGRAFICHE, globals.Table.LAVORATORI);
		if (fsLav.find()) {
			fsLav.idlavoratore = vIdLavoratore;
			if (fsLav.search()) {
				var fsTesta = fsLav.lavoratori_to_lavoratori_giustificativitesta;

				// inserimento del record relativo al gruppo in giustificativi testa
				/** @type {JSRecord<db:/ma_anagrafiche/lavoratori_giustificativitesta>}*/
				var newTesta = fsTesta.getRecord(fsTesta.newRecord());
				if (!newTesta)
					throw new Error('Errore durante la creazione del riepilogo della richiesta permessi');

				newTesta.idlavoratore = fsLav.idlavoratore;
				newTesta.datarichiesta = utils.dateFormat(globals.TODAY, globals.EU_DATEFORMAT);
				newTesta.approvatoda = null;
				newTesta.approvatoil = null;
				newTesta.stato = null;
				newTesta.note = vNote;
				newTesta.noteapp = null;

				for (var i = 1; i <= numGiorni; i++) 
				{
					var rec = fs.getRecord(i);
					if(rec['idevento'] == null)
						continue;
					
					// ottenimento informazioni sulla fascia per verifica orari inseriti
					var objInfoFascia = globals.ottieniInformazioniFasciaGiorno(vIdLavoratore, rec['giorno']);
					
					if (!rec['intero']) {
						var _dalleOre = rec['dalleore'].getHours() * 100 + rec['dalleore'].getMinutes();
						var _alleOre = rec['alleore'].getHours() * 100 + rec['alleore'].getMinutes();
						// gestione fasce con orario notturno
						if (objInfoFascia['fineorario'] < objInfoFascia['inizioorario']) {
							if (_dalleOre < objInfoFascia['fineorario'])
								_dalleOre += 2400;
							objInfoFascia['fineorario'] += 2400;
							_alleOre += 2400;
						}

						// gestione del calcolo delle ore a seconda del parametro impostato
						switch (globals.getParameterValue(globals.getDitta(vIdLavoratore), 'MCO')) {
						case 'SF': // di default si effettuano i controlli sulla fascia associate al giorno
						default:
							rec['oreevento'] = globals.calcolaOreEvento(_dalleOre,
								_alleOre,
								objInfoFascia['inizioorario'],
								objInfoFascia['iniziopausa'],
								objInfoFascia['finepausa'],
								objInfoFascia['fineorario'],
								objInfoFascia['totaleorefascia'],
								objInfoFascia['totaleorepausa']);
							break;
						case 'D': // altrimenti il calcolo è diretto
							rec['oreevento'] = globals.calcolaOreEventoDiretto(_dalleOre, _alleOre);
							break;
						
						}

					}
					// inserimento del record relativo al giorno in giustificativi riga
					var recRiga = newTesta.lavoratori_giustificativitesta_to_lavoratori_giustificativirighe.getRecord(newTesta.lavoratori_giustificativitesta_to_lavoratori_giustificativirighe.newRecord());//fsRiga.getRecord(fsRiga.newRecord(false));
					if (!recRiga)
						throw new Error('Errore durante la creazione del dettaglio richiesta');

					recRiga.idlavoratore = newTesta.idlavoratore;
					recRiga.giorno = rec['giorno'];
					recRiga.giornointero = rec['intero'];
					recRiga.dalleore = rec['dalleore'];
					recRiga.alleore = rec['alleore'];
					recRiga.idevento = rec['idevento'];
					recRiga.proprieta = rec['codiceproprieta'];
					recRiga.ore = !rec['intero'] ? rec['oreevento'] : 0;
					recRiga.importo = 0;
				
					// controllo valore del campo ore in caso di giorno non intero
					if(recRiga.ore == null)
						throw new Error('Errore durante il calcolo delle ore di permesso per il giorno ' + globals.dateFormat(recRiga.giorno,globals.EU_DATEFORMAT) + '...')
				}
				
				// inserimento valori richiesta
				var success = databaseManager.commitTransaction();
								
				// verifica del corretto inserimento dei dati della richiesta nel database
				var idLavoratoreGiustificativoTesta = -1;
				if (!success) {
					var failedrecords = databaseManager.getFailedRecords();
					
					databaseManager.rollbackTransaction(true);
										
					if (failedrecords && failedrecords.length > 0) {
						for (var f = 0; f < failedrecords.length; f++)
							application.output(failedrecords[f].exception.getErrorCode() + ' - ' + failedrecords[f].exception.getMessage(), LOGGINGLEVEL.WARNING);
					}
					
					throw new Error('Errore durante il salvataggio della richiesta. Provare a rieffettuare l\'inserimento o contattare il servizio di assistenza ');
				}
				
				idLavoratoreGiustificativoTesta = newTesta.idlavoratoregiustificativotesta;
				if(!(idLavoratoreGiustificativoTesta instanceof Number))
				{
					throw new Error("Errore in fase di inserimento della richiesta. Provare a rieffettuare l\'inserimento o contattare il servizio di assistenza");
				}
				
				// verificare se così il dato è sempre presente
				databaseManager.refreshRecordFromDatabase(newTesta,-1);
				
				// aggiornamento visualizzazione situazione richieste
				globals.ma_utl_setStatus(globals.Status.BROWSE, controller.getName());
				globals.svy_mod_closeForm(event);
				
				// gestione dell'impostazione di base per l'invio delle comunicazioni via mail
				var invioMail = !globals.ma_utl_hasKey(globals.Key.NON_INVIARE_MAIL);
							
				// gestione dell'invio mail di avvenuto inserimento di una nuova richiesta al gestore oppure nel caso
				// del gestore stesso che inserisce richieste per i suoi subordinati, al relativo subordinato
				var scIdMailSuperiore = globals.ma_utl_getSecurityKeyId(globals.Key.NON_INVIARE_MAIL);
				
				// gestione eventuale utilizzo lingua inglese
				var scIdEnglishLang = globals.ma_utl_getSecurityKeyId(globals.Key.ENGLISH_LAN);
				
				// verifica se l'utente ha eventualmente inibita l'approvazione automatica
				var bApprovazioneDisabilitata = globals.ma_utl_hasKey(globals.Key.RICHIESTA_PERMESSI_NO_APPROVAZIONE);
				
				// verifica se l'utente ha la possibilità di auto-approvazione delle proprie richieste
				var bAutoApprovazione = globals.ma_utl_hasKey(globals.Key.RICHIESTA_PERMESSI_AUTO_APPROVAZIONE);
				
				// variabile booleana per identificare se il gestore stia inserendo una richiesta per se stesso o meno
				var bAutoRichiesta = vIsGestore ? (_to_sec_user$user_id.sec_user_to_sec_user_to_lavoratori.idlavoratore == vIdLavoratore) : true;
				
				// gestone autoapprovazione
				if(!vIsGestore)
				{
					// gestione autoapprovazione caso utente
					// se l'evento non è da autorizzare, gestisci la richiesta
					var idDitta = globals.getDitta(vIdLavoratore);
					var isDaAutorizzare = globals.isEventoDaAutorizzare(idDitta, fs.getRecord(i - 1)['idevento']);
					if (!isDaAutorizzare) 
					{
						globals.gestisciRichiesta(idLavoratoreGiustificativoTesta, 1, false);
						plugins.busy.unblock();
						databaseManager.setAutoSave(false);
						return true;
					}
					
					// in caso di autoapprovazione gestisci la richiesta
					if(bAutoApprovazione)
					  globals.gestisciRichiesta(idLavoratoreGiustificativoTesta, 1, false);
										
				}
				else
				{
					// nel caso di possesso della chiave di autoapprovazione
					// oppure
					// nel caso di inserimento da parte del caporeparto/gestore per un sottoposto
					// ove non sia esplicitata la disabilitazione dell'approvazione
					// allora viene confermata automaticamente la richiesta inserita
					if (bAutoApprovazione
						||	(vIsGestore 
							&& !bAutoRichiesta 
							&& solutionModel.getForm('rp_elenco_richieste_situazione')))
//					{
						globals.gestisciRichiesta(idLavoratoreGiustificativoTesta, 1, false);
//					    plugins.busy.unblock();
//						databaseManager.setAutoSave(false);
//						return true;
//					}
				}
								
				var emailaddresses = [];
				/** @type{Array<Number>}*/
				var emailaddressesOthers = [];
				var emailaddressesConfirm = [];
				var emailaddressesRefuse = [];

				var infoSup
				var infoTuple
				var fsRpGroupsInfo
				var fsRpUsersInfo

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

				var isFemmina = globals.isFemmina(vIdLavoratore);

				if (!vIsGestore) {
					// determinazione dell'eventuale gap dei livelli per l'autorizzazione della gestione
					var livAut = 0;

					fsRpGroupsInfo = globals.getRpGroupsInfo(globals.svy_sec_lgn_organization_id);
					fsRpUsersInfo = globals.getRpUsersInfo(globals.svy_sec_lgn_organization_id);

					if (fsRpGroupsInfo || fsRpUsersInfo) {
						if (fsRpGroupsInfo) {
							for (var gr = 1; gr <= fsRpGroupsInfo.getSize(); gr++) {
								var users = globals.getOrganizationUsers(fsRpGroupsInfo.getRecord(gr).rp_group_id.toString());
								for (var au = 0; au < users.length; au++) {
									infoTuple = [users[au], globals.getMailUtente(users[au]), 1000];
									if (fsRpGroupsInfo.getRecord(gr).gestione_richiesta)
										emailaddresses.push(infoTuple);
									if (fsRpGroupsInfo.getRecord(gr).avviso_conferma && users[au] != globals.svy_sec_lgn_user_id && emailaddressesConfirm.indexOf(users[au]) == -1)
										emailaddressesConfirm.push(users[au]);
									if (fsRpGroupsInfo.getRecord(gr).avviso_rifiuto && users[au] != globals.svy_sec_lgn_user_id && emailaddressesRefuse.indexOf(users[au]) == -1)
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
								if (fsRpUsersInfo.getRecord(us).avviso_conferma && fsRpUsersInfo.getRecord(us).rp_user_id != globals.svy_sec_lgn_user_id && emailaddressesConfirm.indexOf(fsRpUsersInfo.getRecord(us).rp_user_id) == -1)
									emailaddressesConfirm.push(fsRpUsersInfo.getRecord(us).rp_user_id);
								if (fsRpUsersInfo.getRecord(us).avviso_rifiuto && fsRpUsersInfo.getRecord(us).rp_user_id != globals.svy_sec_lgn_user_id && emailaddressesRefuse.indexOf(fsRpUsersInfo.getRecord(us).rp_user_id) == -1)
									emailaddressesRefuse.push(fsRpUsersInfo.getRecord(us).rp_user_id);
								if (fsRpUsersInfo.getRecord(us).rp_user_id != globals.svy_sec_lgn_user_id && emailaddressesOthers.indexOf(fsRpUsersInfo.getRecord(us).rp_user_id) == -1 && emailaddressesConfirm.indexOf(fsRpUsersInfo.getRecord(us).rp_user_id) == -1 && emailaddressesRefuse.indexOf(fsRpUsersInfo.getRecord(us).rp_user_id) == -1)
									emailaddressesOthers.push(fsRpUsersInfo.getRecord(us).rp_user_id);
							}
						}
					} else {
						livAut = globals.getDeltaLivelloAutorizzazione(globals.svy_sec_lgn_user_org_id,
							globals.svy_sec_lgn_user_id,
							_to_sec_user$user_id.sec_user_to_sec_user_org.sec_user_org_to_sec_user_in_group.sec_user_in_group_to_sec_group.group_id);

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
									emailaddressesOthers.push(infoSup.getValue(iu, 1)); 
								}

							}
						}
					}

					// gestione caso di autoapprovazione (utente) : in caso di 'autogestione' deve poter arrivare, se specificato, una mail di riepilogo dell'avvenuto
					// inserimento della richiesta (senza la parte con il testo di gestione ovviamente)
					if(bAutoApprovazione && emailaddressesOthers.length)
					{
						for(var _emao = 0; _emao < emailaddressesOthers.length; _emao++)
						{
							var _arrEmao = [emailaddressesOthers[_emao],globals.getMailUtente(emailaddressesOthers[_emao]),null];
							if(emailaddresses.indexOf(_arrEmao) == -1)
								emailaddresses.push(_arrEmao);
						}
					}
					
					// compilazione campo 'gestitoda' con indicazione dei nominativi di chi gestirà la richiesta
					globals.ma_sec_removeUsersFilters();
					
					/** @type {String} */
					var gestitoDa = '';
					
					if(bAutoApprovazione)
					   gestitoDa = _to_sec_user$user_id.user_id ? globals.getUserName(_to_sec_user$user_id.user_id) : security.getUserName();
					else
					{
					   for (var gd = 0; gd < emailaddresses.length; gd++) {
						  gestitoDa += globals.getUserName(emailaddresses[gd][0]);
						  if (gd != emailaddresses.length - 1)
							gestitoDa += ',';
						}		   
					}
					
					databaseManager.startTransaction();
					newTesta.gestitoda = gestitoDa;
					databaseManager.commitTransaction();
					globals.ma_sec_setUsersFilters();
					
					// gestione della fase di invio della mail (se necessario)
					if(invioMail)
					{
						for (var e = 0; e < emailaddresses.length; e++) {
							// costruzione intestazione e testo mail
							var subject = (bSubjectNom ? globals.getNominativo(vIdLavoratore) + " - " : "") + "Comunicazione nuova richiesta ferie e permessi - Presenza Semplice Studio Miazzo";
							var subjectEn = "Advice for new request - Presenza Semplice Studio Miazzo";
							var msgText = "plain msg<html>";
							msgText += "<head><meta http-equiv=\"Content-Type\" content=\"text/html; charset=utf-8\"></head>";
							msgText += "<body>";
							var msgTextEn = msgText; //'<i>English version : </i><br/><p style = "font-size:14px">';

							// link per il servizio di gestione richiesta con restful web service
							var url = globals.RfpServerLink + //"https://webapp.studiomiazzo.it" + 
							          "/rp_servlet?idgiustificativotesta=" + idLavoratoreGiustificativoTesta + 
									  "&cliente=" + globals.customer_dbserver_name + 
									  "&operatore=" + emailaddresses[e][0] + 
									  "&wsurl=" + globals.WS_RFP_URL + 
									  "&userid=" + _to_sec_user$user_id.user_id + 
									  "&othersid=" + emailaddressesOthers.join(',') + 
									  "&confirmsid=" + emailaddressesConfirm.join(',') + 
									  "&refusesid=" + emailaddressesRefuse.join(',');
	
							if (emailaddresses[e] && plugins.mail.isValidEmailAddress(emailaddresses[e][1])) {
								msgText += "Gentile <b>" + globals.getUserName(emailaddresses[e][0]) + "</b>, <br/> con la presente le comunichiamo l\'inserimento di una nuova richiesta di ";
								msgTextEn += "Dear <b>" + globals.getUserName(emailaddresses[e][0]) + "</b>, <br/> we inform you that a new request of <i>" + globals.getDescrizioneEvento(recRiga.idevento) + "</i>  has been inserted ";

								msgText += '<i>' + globals.getDescrizioneEvento(recRiga.idevento) + '</i>';

								msgText += " da parte del" + (isFemmina ? "la" : "") + " dipendente <b>" + globals.getNominativo(vIdLavoratore) + '</b>';
								msgTextEn += " by <b>" + globals.getNominativo(vIdLavoratore) + '</b>';

								if (vDal == vAl) {
									msgText += (" relativa al giorno <b>" + utils.dateFormat(vDal, globals.EU_DATEFORMAT)) + '</b>';
									msgTextEn += (" on the day <b>" + utils.dateFormat(vDal, globals.EU_DATEFORMAT)) + '</b>';

									if (!recRiga.giornointero) {
										msgText += " dalle ore " + utils.dateFormat(recRiga.dalleore, globals.OREMINUTI_DATEFORMAT);
										msgTextEn += " since " + utils.dateFormat(recRiga.dalleore, globals.OREMINUTI_DATEFORMAT);

										msgText += " alle ore " + utils.dateFormat(recRiga.alleore, globals.OREMINUTI_DATEFORMAT);
										msgTextEn += " until " + utils.dateFormat(recRiga.alleore, globals.OREMINUTI_DATEFORMAT);
									}
									msgText += ". <br/>";
									msgTextEn += ". <br/>";
								} else {
									msgText += (" relativa al periodo che va dalla data <b>" + utils.dateFormat(vDal, globals.EU_DATEFORMAT) + "</b> alla data <b>" + utils.dateFormat(vAl, globals.EU_DATEFORMAT) + "</b>. <br/>");
									msgTextEn += (" since <b>" + utils.dateFormat(vDal, globals.EU_DATEFORMAT) + "</b> until <b>" + utils.dateFormat(vAl, globals.EU_DATEFORMAT) + "</b>. <br/>");
								}

								msgText += '<br/>';
								msgTextEn += '<br/>';

								if (vNote != null && vNote != '') {
									msgText += 'Note della richiesta : ' + '<i>' + vNote + '</i>';
									msgTextEn += 'Additional notes : ' + '<i>' + vNote + '</i>';
								}

								msgText += '<br/><br/>';
								msgTextEn += '<br/><br/>';

								if (!bAutoApprovazione && (emailaddresses[e][2] == 1000 || (livAut != undefined && emailaddresses[e][2] == livAut))) {
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
								{
									// non è stato possibile creare il testo della mail, reinviarla dall'elenco richieste 
									var msgErrMail = 'Si è verificato un errore durante la creazione e l\'invio della mail al/i responsabile/i. Controllare se la richiesta sia stata comunque inserita.\n';
									msgErrMail += 'In questo caso è possibile inviare la mail posizionandosi sulla richiesta e cliccando con tasto destro del mouse, selezionare quindi <b>Invia nuovamente comunicazione</b>.';
									msgErrMail += 'In caso negativo, provare a rieffettuare la richiesta o contattare il servizio di assistenza.\n\n';
									msgErrMail += 'ERRORE : ' + plugins.mail.getLastSendMailExceptionMsg();
									throw new Error(msgErrMail);
								}
							} else
								globals.ma_utl_showWarningDialog(emailaddresses[e][1] + ' : ' + 'i18n:ma.msg.notValidEmailAddress', 'Comunicazione gestione richiesta');
						}
					}
				}
				// nel primo caso la mail va inviata al/i superiore/i nel secondo al dipendente
				else {
					// se sta inserendo una richiesta per se stesso oppure è in possesso della chiave che blocca l'approvazione
					if (bAutoRichiesta || bApprovazioneDisabilitata) {
						// se è una richiesta per se stesso segue l'iter dell'organizzazione di appartenenza
						if (bAutoRichiesta) {
							fsRpGroupsInfo = globals.getRpGroupsInfo(globals.svy_sec_lgn_organization_id);
							fsRpUsersInfo = globals.getRpUsersInfo(globals.svy_sec_lgn_organization_id);
						}
						// altrimenti bisogna recuperare l'organizzazione del dipendente selezionato
						else {
							var fsUser = globals.getUserFromIdLavoratore(vIdLavoratore, globals.svy_sec_lgn_owner_id);
							var fsUserOrg = fsUser.sec_user_to_lavoratori_to_sec_user.sec_user_to_sec_user_org;
							// se l'organizzazione è unica
							if (fsUserOrg.getSize() == 1) {
								var userOrganizationId = fsUserOrg.sec_user_org_to_sec_organization.organization_id;
								fsRpGroupsInfo = globals.getRpGroupsInfo(userOrganizationId);
								fsRpUsersInfo = globals.getRpUsersInfo(userOrganizationId);
							}
							// altrimenti non è possibile identificarla in maniera univoca
							else {
								throw new Error('Impossibile identificare univocamente l\'organizzazione di appartenenza del dipendente : ' + globals.getNominativo(vIdLavoratore));
//									globals.ma_utl_showInfoDialog('Impossibile identificare univocamente l\'organizzazione di appartenenza del dipendente : ' + globals.getNominativo(vIdLavoratore));
//									return false;
							}
						}

						if (fsRpGroupsInfo || fsRpUsersInfo) {
							if (fsRpGroupsInfo) {
								for (var _gr = 1; _gr <= fsRpGroupsInfo.getSize(); _gr++) {
									var _users = globals.getOrganizationUsers(fsRpGroupsInfo.getRecord(_gr).rp_group_id.toString());
									for (var _au = 0; _au < _users.length; _au++) {
										infoTuple = [_users[_au], globals.getMailUtente(_users[_au]), 1000];
										if (fsRpGroupsInfo.getRecord(_gr).gestione_richiesta)
											emailaddresses.push(infoTuple);
										if (fsRpGroupsInfo.getRecord(_gr).avviso_conferma && _users[_au] != globals.svy_sec_lgn_user_id && emailaddressesConfirm.indexOf(_users[_au]) == -1)
											emailaddressesConfirm.push(_users[_au]);
										if (fsRpGroupsInfo.getRecord(_gr).avviso_rifiuto && _users[_au] != globals.svy_sec_lgn_user_id && emailaddressesRefuse.indexOf(_users[_au]) == -1)
											emailaddressesRefuse.push(_users[_au]);
										if (_users[_au] != globals.svy_sec_lgn_user_id && emailaddresses.indexOf(_users[_au]) == -1 && emailaddressesConfirm.indexOf(_users[_au]) == -1 && emailaddressesRefuse.indexOf(_users[_au]) == -1 && emailaddressesOthers.indexOf(_users[_au]) == -1)
											emailaddressesOthers.push(_users[_au]);
									}
								}

							}

							if (fsRpUsersInfo) {
								for (var _us = 1; _us <= fsRpUsersInfo.getSize(); _us++) {
									infoTuple = [fsRpUsersInfo.getRecord(_us).rp_user_id,
									             globals.getMailUtente(fsRpUsersInfo.getRecord(_us).rp_user_id), 1000];
									if (fsRpUsersInfo.getRecord(_us).gestione_richiesta)
										emailaddresses.push(infoTuple);
									if (fsRpUsersInfo.getRecord(_us).avviso_conferma && fsRpUsersInfo.getRecord(_us).rp_user_id != globals.svy_sec_lgn_user_id && emailaddressesConfirm.indexOf(fsRpUsersInfo.getRecord(_us).rp_user_id) == -1)
										emailaddressesConfirm.push(fsRpUsersInfo.getRecord(_us).rp_user_id);
									if (fsRpUsersInfo.getRecord(_us).avviso_rifiuto && fsRpUsersInfo.getRecord(_us).rp_user_id != globals.svy_sec_lgn_user_id && emailaddressesRefuse.indexOf(fsRpUsersInfo.getRecord(_us).rp_user_id) == -1)
										emailaddressesRefuse.push(fsRpUsersInfo.getRecord(_us).rp_user_id);
									if (fsRpUsersInfo.getRecord(_us).rp_user_id != globals.svy_sec_lgn_user_id && emailaddresses.indexOf(fsRpUsersInfo.getRecord(_us).rp_user_id) == -1 && emailaddressesConfirm.indexOf(fsRpUsersInfo.getRecord(_us).rp_user_id) == -1 && emailaddressesRefuse.indexOf(fsRpUsersInfo.getRecord(_us).rp_user_id) == -1 && emailaddressesOthers.indexOf(fsRpUsersInfo.getRecord(_us).rp_user_id) == -1)
										emailaddressesOthers.push(fsRpUsersInfo.getRecord(_us).rp_user_id);
								}
							}

						} else {
							// recupero del/i corretto/i indirizzo/i mail a cui inviare l'avviso di avvenuto inserimento di richiesta
							livAut = globals.getDeltaLivelloAutorizzazione(globals.svy_sec_lgn_user_org_id,
								globals.svy_sec_lgn_user_id,
								_to_sec_user$user_id.sec_user_to_sec_user_org.sec_user_org_to_sec_user_in_group.sec_user_in_group_to_sec_group.group_id);
							var infoSupGest = globals.getInfoUsersLivelliSuperiori(globals.svy_sec_lgn_user_org_id);
							for (var ig = 1; ig <= infoSupGest.getMaxRowIndex(); ig++) {
								if (infoSupGest.getValue(ig, 1) != _to_sec_user$user_id.user_id && globals.ma_utl_getOwnerFromUserOrgId(infoSupGest.getValue(ig, 4)) == globals.svy_sec_lgn_owner_id) {
									// se 1- il livello superiore rientra negli n livelli di profondità a cui cercare (di default il livello è pari a 1,
									//      altrimenti è indicato dal possesso delle chiavi del tipo RICHIESTA_PERMESSI_n_LIV)
									//    2- l'utente di questa organizzazione non è per qualche motivo inibito alla ricezione della mail di avvenuto
									//      inserimento della nuova richiesta
									// aggiungi il suo indirizzo all'array di indirizzi a cui mandare l'avviso
									if (infoSupGest.getValue(ig, 5) <= livAut && !globals.ma_utl_userHasKey(infoSupGest.getValue(ig, 1), scIdMailSuperiore, infoSupGest.getValue(ig, 6), infoSupGest.getValue(ig, 4))) {
										var infoTupleGest = [infoSupGest.getValue(ig, 1), infoSupGest.getValue(ig, 3), infoSupGest.getValue(ig, 5), infoSupGest.getValue(ig, 4)];
										emailaddresses.push(infoTupleGest);
										emailaddressesOthers.push(infoSupGest.getValue(ig, 1));
									}
								}
							}
						}

						// se non è una richiesta di un caporeparto per se stesso, aggiungiamo il suo user_id
						// alla lista di id ai quali verrà comunicata la conferma od il rifiuto della richiesta
						if (!bAutoRichiesta) {
							emailaddressesConfirm.push(globals.svy_sec_lgn_user_id);
							emailaddressesRefuse.push(globals.svy_sec_lgn_user_id);
						}

					}

					// inoltre se sta inserendo una richiesta per un sottoposto va inviata (se necessaria) una mail al dipendente oggetto della richiesta
					if (!bAutoRichiesta) {
						var userDipId = globals.getUserIdFromIdLavoratore(vIdLavoratore, globals.svy_sec_lgn_owner_id);
						var infoTupleDip = [userDipId,
							globals.getMailUtente(userDipId),
							null,
							null];
						if (scIdMailSuperiore) {
							var answerRicGestore = globals.ma_utl_showYesNoQuestion('Inviare una mail di conferma inserimento al dipendente?', 'Invio mail per richiesta inserita');
							if (answerRicGestore)
								emailaddresses.push(infoTupleDip);
						}
					}
					
					// gestione caso di autoapprovazione : in caso di 'autogestione' deve poter arrivare, se specificato, una mail di riepilogo dell'avvenuto
					// inserimento della richiesta (senza la parte con il testo di gestione ovviamente)
					if(bAutoApprovazione && emailaddressesOthers.length)
					{
						for(var emao = 0; emao < emailaddressesOthers.length; emao++)
						{
							var arrEmao = [emailaddressesOthers[emao],globals.getMailUtente(emailaddressesOthers[emao]),null];
							if(emailaddresses.indexOf(arrEmao) == -1)
								emailaddresses.push(arrEmao);
						}
					}
									
					// compilazione campo 'gestitoda' con indicazione dei nominativi di chi dovrà gestire la richiesta	
					/** @type {String} */
					var gestitoDaResp = '';
					var arrGestitoDa = [];
					
					globals.ma_sec_removeUsersFilters();
					
					if(bAutoApprovazione)
					   gestitoDaResp = _to_sec_user$user_id.user_id ? globals.getUserName(_to_sec_user$user_id.user_id) : security.getUserName();
					else
					{						
						for (var gdArrResp = 0; gdArrResp < emailaddresses.length; gdArrResp++) {
							// evitando l'eventuale user id del lavoratore per il quale si sta inserendo una richiesta
							if (emailaddresses[gdArrResp][0] != globals.getUserIdFromIdLavoratore(vIdLavoratore, globals.svy_sec_lgn_owner_id))
								arrGestitoDa.push(emailaddresses[gdArrResp]);
						}
	
						for (var gdResp = 0; gdResp < arrGestitoDa.length; gdResp++) {
							gestitoDaResp += globals.getUserName(arrGestitoDa[gdResp][0]);
							if (gdResp != arrGestitoDa.length - 1)
								gestitoDaResp += ',';
						}
					}
					
					databaseManager.startTransaction();
					newTesta.gestitoda = gestitoDaResp;
					databaseManager.commitTransaction();
									
					globals.ma_sec_setUsersFilters();
														
					// gestione della fase di invio della mail (se necessario)
					if(invioMail)
					{
						// ciclo per l'invio delle mail verso coloro che dovranno gestire la richiesta
						for (var m = 0; m < emailaddresses.length; m++) {
							if (emailaddresses[m] && plugins.mail.isValidEmailAddress(emailaddresses[m][1])) {

								// costruzione intestazione e testo mail
								var subjectCr = (bSubjectNom ? globals.getNominativo(vIdLavoratore) + " - " : "") + "Comunicazione nuova richiesta ferie e permessi - Presenza Semplice Studio Miazzo";
								var subjectCrEn = "Advice for new request - Presenza Semplice Studio Miazzo";
								var msgTextCr = "plain msg<html>";
								msgTextCr += "<head><meta http-equiv=\"Content-Type\" content=\"text/html; charset=utf-8\"></head>";
								msgTextCr += "<body>";
								var msgTextCrEn = msgTextCr; //"<i>English version : </i><br/><p style = \"font-size\":8px>";

								// link per il servizio di gestione richiesta con restful web service
								var urlCr = globals.RfpServerLink + //application.getServerURL() + 
								            "/rp_servlet?idgiustificativotesta=" + idLavoratoreGiustificativoTesta +
											"&cliente=" + globals.customer_dbserver_name +
											"&operatore=" + ( (bAutoRichiesta || bApprovazioneDisabilitata) ? emailaddresses[m][0] : _to_sec_user$user_id.user_id) + 
											"&wsurl=" + globals.WS_RFP_URL + 
											"&userid=" + (bAutoRichiesta ? _to_sec_user$user_id.user_id : globals.getUserIdFromIdLavoratore(vIdLavoratore, globals.svy_sec_lgn_owner_id)) + 
											"&othersid=" + emailaddressesOthers.join(',') + 
											"&confirmsid=" + emailaddressesConfirm.join(',') + 
											"&refusesid=" + emailaddressesRefuse.join(',');

								msgTextCr += "Gentile <b>" + globals.getUserName(emailaddresses[m][0]) + "</b> <br/> con la presente le comunichiamo l\'avvenuto inserimento di una nuova ";
								msgTextCrEn += "Dear <b>" + globals.getUserName(emailaddresses[m][0]) + "</b> <br/> we inform you that has been inserted a new ";

								if (bAutoRichiesta) {
									msgTextCr += "richiesta di <i>" + globals.getDescrizioneEvento(recRiga.idevento) + "</i> da parte del dipendente <b>" + globals.getNominativo(vIdLavoratore) + '</b>';
									msgTextCrEn += "request of <i>" + globals.getDescrizioneEvento(recRiga.idevento) + "</i> by <b>" + globals.getNominativo(vIdLavoratore) + '</b>';
								} else {
									if (bApprovazioneDisabilitata) {
										msgTextCr += "richiesta di <i>" + globals.getDescrizioneEvento(recRiga.idevento) + "</i> da parte del responsabile <b> " + globals.getUserName(_to_sec_user$user_id.user_id) + '</b>';
										msgTextCrEn += "request of <i>" + globals.getDescrizioneEvento(recRiga.idevento) + "</i> by <b> " + globals.getUserName(_to_sec_user$user_id.user_id) + '</b>';
									} else {
										msgTextCr += "pianificazione <i>" + globals.getDescrizioneEvento(recRiga.idevento) + "</i> da parte del responsabile <b> " + globals.getUserName(_to_sec_user$user_id.user_id) + '</b>';
										msgTextCrEn += "planning <i>" + globals.getDescrizioneEvento(recRiga.idevento) + "</i> by <b> " + globals.getUserName(_to_sec_user$user_id.user_id) + '</b>';
									}
									if (emailaddresses[m][2] != null) {
										msgTextCr += " per " + (isFemmina ? "la" : "il") + " dipendente <b>" + globals.getNominativo(vIdLavoratore) + " </b>";
										msgTextCrEn += " for " + globals.getNominativo(vIdLavoratore) + " </b>";
									}
								}

								if (vDal == vAl) {
									msgTextCr += (" relativa al giorno <b>" + utils.dateFormat(vDal, globals.EU_DATEFORMAT) + '</b>');
									msgTextCrEn += (" on the day <b>" + utils.dateFormat(vDal, globals.EU_DATEFORMAT) + '</b>');

									if (!recRiga.giornointero) {
										msgTextCr += " dalle ore " + utils.dateFormat(recRiga.dalleore, globals.OREMINUTI_DATEFORMAT);
										msgTextCrEn += " since " + utils.dateFormat(recRiga.dalleore, globals.OREMINUTI_DATEFORMAT);

										msgTextCr += " alle ore " + utils.dateFormat(recRiga.alleore, globals.OREMINUTI_DATEFORMAT);
										msgTextCrEn += " until " + utils.dateFormat(recRiga.alleore, globals.OREMINUTI_DATEFORMAT);
									}
								} else {
									msgTextCr += (" relativa al periodo che va dalla data <b>" + utils.dateFormat(vDal, globals.EU_DATEFORMAT) + "</b> alla data <b>" + utils.dateFormat(vAl, globals.EU_DATEFORMAT) + "</b>. <br/>");
									msgTextCrEn += (" for the period since <b>" + utils.dateFormat(vDal, globals.EU_DATEFORMAT) + "</b> until <b>" + utils.dateFormat(vAl, globals.EU_DATEFORMAT) + "</b>. <br/>");
								}

								msgTextCr += '<br/>';
								msgTextCrEn += '<br/>';

								if (vNote != null && vNote != '') {
									msgTextCr += 'Note della richiesta : ' + '<i>' + vNote + '</i>';
									msgTextCrEn += 'Additional notes : ' + '<i>' + vNote + '</i>';
								}
								msgTextCr += '<br/><br/>';
								msgTextCrEn += '<br/><br/>';

								if (!bAutoApprovazione && (emailaddresses[m][2] == 1000 || (livAut != undefined && emailaddresses[m][2] == livAut))) {
									msgTextCr += '<a href= ' + urlCr + "&status=1" + '>Confermare richiesta</a>';
									msgTextCr += '<br/><br/>';
									msgTextCr += '<a href=' + urlCr + "&status=2" + '>Rifiutare richiesta</a>';
									msgTextCr += "<br/><br/><br/>In alternativa collegarsi all\'<a href='https://webapp.studiomiazzo.it/login.html'>applicazione</a> per la gestione delle richieste."

									msgTextCrEn += '<a href= ' + urlCr + "&status=1" + '>Confirm request</a>';
									msgTextCrEn += '<br/><br/>';
									msgTextCrEn += '<a href=' + urlCr + "&status=2" + '>Refuse request</a>';
									msgTextCrEn += "<br/><br/><br/>Alternatively, go to the <a href='https://webapp.studiomiazzo.it/login.html'>application</a> to handle the requests."
								}

								//							msgTextCrEn += '</p>';
								msgTextCrEn += "</body></html>";
								msgTextCr += "</body></html>";

								// english language
								var englishLangCr = globals.ma_utl_userHasKey(emailaddresses[m][0],scIdEnglishLang);

								if (!plugins.mail.sendMail
								(emailaddresses[m][1],
									'Ferie e permessi <assistenza@studiomiazzo.it>',
									englishLangCr ? subjectCrEn : subjectCr,
									englishLangCr ? msgTextCrEn : msgTextCr,
									null,
									null,
									null,
									globals.setSparkPostSmtpProperties()
								)
								)
								{
									// non è stato possibile creare il testo della mail, reinviarla dall'elenco richieste 
									var msgErrMailCr = 'Si è verificato un errore durante la creazione e l\'invio della mail al/i responsabile/i. Controllare se la richiesta sia stata comunque inserita.\n';
									msgErrMailCr += 'In questo caso è possibile inviare la mail posizionandosi sulla richiesta e cliccando con tasto destro del mouse, selezionare quindi <b>Invia nuovamente comunicazione</b>.';
									msgErrMailCr += 'In caso negativo, provare a rieffettuare la richiesta o contattare il servizio di assistenza.\n\n';
									msgErrMailCr += 'ERRORE : ' + plugins.mail.getLastSendMailExceptionMsg();
									throw new Error(msgErrMailCr);
								}
							} else
								globals.ma_utl_showWarningDialog(emailaddresses[m][1] + ' : ' + 'i18n:ma.msg.notValidEmailAddress', 'Comunicazione gestione richiesta');
						}
					}
				}
				
				if (globals.nav.program['RP_ElencoRichieste']) {
					var tabIndex = globals.nav.program['RP_ElencoRichieste'].tab.selected;
					globals.refreshElenco(event, tabIndex == 1 ? true : false);
				}

			} else
				globals.ma_utl_showErrorDialog('Impossibile inserire la richiesta. Verificare i filtri impostati per il lavoratore', 'Richiesta permessi');
		} else
			globals.ma_utl_showWarningDialog('Cannot go to find mode', 'Richiesta permessi');

	} catch (ex) {
		application.output(ex.message, LOGGINGLEVEL.ERROR);
		databaseManager.rollbackTransaction();
		
		refreshRichieste(event);
		
		ex.message != '' ? globals.ma_utl_showErrorDialog(ex.message) : globals.ma_utl_showErrorDialog('Verificare in elenco l\'avvenuto inserimento della richiesta.\nLa mail di notifica potrebbe non essere stata generata ed inoltrata al gestore.\nSe la richiesta non è presente,provare a rieffettuare l\'inserimento o contattare il servizio di assistenza dello Studio e comunicare l\'anomalia.');
		return false;
	} finally {
		plugins.busy.unblock();
		databaseManager.setAutoSave(false);
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
 * @properties={typeid:24,uuid:"0951A766-DCDE-49D4-AE1C-2EF0F69B4A74"}
 */
function annullaNuovaRichiesta(event) 
{
	//gestione rollback e chiusura modale
	databaseManager.setAutoSave(false);
	databaseManager.rollbackTransaction();
	globals.ma_utl_setStatus(globals.Status.BROWSE, controller.getName());
	globals.svy_mod_closeForm(event);
	
	refreshRichieste(event);
}

/**
 * TODO generated, please specify type and doc for the params
 * @param event
 *
 * @properties={typeid:24,uuid:"CB447BD3-101E-4A56-AE1C-B3283F77838B"}
 */
function refreshRichieste(event)
{
	// refresh visualizzazione 
	if (globals.nav.program['RP_ElencoRichieste'])
		globals.refreshElenco(event, globals.nav.program['RP_ElencoRichieste'].tab.selected == 1 ? true : false);
	else
		databaseManager.refreshRecordFromDatabase(forms.rp_gestione_richieste_da_evadere_tbl.foundset,-1);
}

/** *
 * @param _firstShow
 * @param _event
 *
 * @properties={typeid:24,uuid:"EEB0DAF7-E949-46DD-ACC7-88E2640187E8"}
 */
function onShowForm(_firstShow, _event) {
	plugins.busy.prepare();

	_super.onShowForm(_firstShow, _event);

	elements.btn_reload.enabled = true;

	// puliamo da eventuali precedenti richieste
	vNote = null;
	elements.tab_dtl.removeAllTabs();

	// disabilitiamo il salvataggio automatico
	databaseManager.setAutoSave(false);

	//databaseManager.startTransaction();

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
 * @properties={typeid:24,uuid:"6DB331A5-AEE4-43B1-B14C-39E77D223DF3"}
 */
function onDataChangeData(oldValue, newValue, event) {

	var frmNameTemp = 'rp_richiesta_permessi_tbl_temp';

	if (forms[frmNameTemp] != null) {
		databaseManager.rollbackTransaction();
		forms[event.getFormName()].elements.tab_dtl.removeAllTabs();
		history.removeForm(frmNameTemp);
		solutionModel.removeForm(frmNameTemp);
	}
	
	if (event.getElementName() == elements.fld_dal.getName()
		&& (vAl == null || vAl < vDal))
		vAl = new Date(vDal);
	
	process_refresh_calendario(event);
	
	return true;
}

/**
 * Perform the element default action
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"ED6DFC46-84A6-415A-8B03-168314C742AD"}
 */
function onActionInfoSitRatei(event) {
	var _proiezioneRatei = globals.getParameterValue(globals.getDitta(vIdLavoratore), 'CRM') == 'C' ? true : false;
	var frm = forms.rp_list_ratei_reparto_dipendente;
	var ultimoPeriodoPredisposto = globals.getUltimoPeriodoPredisposto(vIdLavoratore);
	var date = globals.getLastDatePeriodo(ultimoPeriodoPredisposto);
	globals.ma_utl_showFormInDialog(frm.controller.getName()
		, 'Situazione ratei Dip. ' 
		  + globals.getNominativo(vIdLavoratore) 
		  + ' al ' 
		  + globals.dateFormat(date, globals.EU_DATEFORMAT) 
		  + ' (ultimo mese calcolato)'
		, null
		, false
		, _proiezioneRatei ? 900 : 700
		, 200);
	frm.preparaSituazioneRateiLavoratore(vIdLavoratore, globals.TODAY, _proiezioneRatei);
}
/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"94E1BC9A-7672-4489-BD6C-60EA5CC3B440"}
 */
function onActionTest(event) {
forms.rp_lkp_eventi.onShowForm(true,event)
}
