/**
 * @type {Array<Number>} 
 * 
 * @properties={typeid:35,uuid:"87CBB9DB-5599-4798-A7D6-17288697131E",variableType:-4}
 */
var vArrIdLavoratore = null;

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 * 
 * @properties={typeid:24,uuid:"71B81B7F-2476-406B-8A10-01857F3426A8"}
 * @SuppressWarnings(unused)
 * @AllowToRunInFind
 */
function process_refresh_calendario(event) {
	try
	{
		if (vDal == null) throw new Error('Specificare il giorno iniziale della richiesta');
		if (vAl < vDal) throw new Error('L\'ultimo giorno della richiesta non può essere inferiore al primo');
		
		elements.btn_reload.enabled = true;
	
		var frmName = 'rp_richiesta_permessi_multi_tbl';
		var frmNameTemp = 'rp_richiesta_permessi_multi_tbl_temp';
	
		forms[event.getFormName()].elements.tab_dtl.removeAllTabs();
	
		if (forms[frmNameTemp] != null) {
			history.removeForm(frmNameTemp);
			solutionModel.removeForm(frmNameTemp);
		}
	
		var tempForm = solutionModel.cloneForm(frmNameTemp, solutionModel.getForm(frmName));
		tempForm.scrollbars = SM_SCROLLBAR.SCROLLBARS_WHEN_NEEDED;
	
		var types = [JSColumn.DATETIME, JSColumn.NUMBER, JSColumn.DATETIME, JSColumn.DATETIME, JSColumn.NUMBER, JSColumn.TEXT, JSColumn.NUMBER];
		var columns = ['Giorno', 'Intero', 'DalleOre', 'AlleOre', 'IdEvento', 'DescEvento', 'OreEvento'];
		var rows = Math.floor( (vAl - vDal) / 86400000) + 1;
		var dsRic = databaseManager.createEmptyDataSet(0, columns);
				
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
		// ticket #15123 inserimento entro x giorni del mese successivo rispetto alla data della richiesta	
		case 'E1GLMS':
			if(globals.getGiornoLavorativoMese(1) > vDal)
			   throw new Error('Non è più possibile inserire una richiesta per il periodo indicato');
			break;
		case 'E2GLMS':
			if(globals.getGiornoLavorativoMese(2) > vDal)
			   throw new Error('Non è più possibile inserire una richiesta per il periodo indicato');
			break;
		case 'E3GLMS':
			if(globals.getGiornoLavorativoMese(3) > vDal)
			   throw new Error('Non è più possibile inserire una richiesta per il periodo indicato');
			break;
		case 'E4GLMS':
			if(globals.getGiornoLavorativoMese(4) > vDal)
			   throw new Error('Non è più possibile inserire una richiesta per il periodo indicato');
			break;	
		default:
			break;
		}
	
		/** type {Array<Number>} */
		var arrPeriodi = [];
		for(var gg = vDal; gg <= vAl; gg = new Date(gg.getFullYear(),gg.getMonth(),gg.getDate() + 1))
		{
			var currPeriodo = gg.getFullYear() * 100 + gg.getMonth() + 1;
			if(arrPeriodi.indexOf(currPeriodo) == -1)
				arrPeriodi.push(currPeriodo);
		}
		
		// verifica ed ignora i giorni festivi (consideriamo solamente il caso delle festività standard qualunque sia il valore impostato per il singolo)
		var arrFestDip = globals.getFestivitaStandard();
						
		// ciclo sui giorni del periodo indicato in richiesta
		for (var i = 1; i <= rows; i++) {
			var g = vDal;
			g.setDate(vDal.getDate() + i - 1)
	
			var arr;
			// per i giorni (teoricamente al momento della richiesta) lavorativi e non festivi aggiungiamo una riga al dataset provvisorio
			if (arrFestDip.length == 0 
					|| arrFestDip.indexOf(globals.dateFormat(g,globals.ISO_DATEFORMAT)) == -1)
			{
				arr = [g
					, 1
					, null
					, null
					, null
					, 'Evento di assenza predefinito (PD o F)'
					, null];
			
				dsRic.addRow(arr);				
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
		solutionModel.getForm(frmNameTemp).getField('fld_desc_evento').dataProviderID = 'descevento';
		solutionModel.getForm(frmNameTemp).getField('fld_ore_evento').dataProviderID = 'oreevento';
	
		solutionModel.getForm(frmNameTemp).getLabel('btn_ric_evento').visible = false;
	
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
 * @properties={typeid:24,uuid:"7D0F5A05-0C2C-4BD5-B374-58370B4CAD5D"}
 */
function validaRichiesta(fs)
{
	// TODO....
	
	return true;
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"703514A6-8CD9-4321-B3EC-7AF198617C42"}
 * @AllowToRunInFind
 */
function confermaNuovaRichiesta(event) {

	//gestione dell'inserimento della richiesta nel database
	var frmName = 'rp_richiesta_permessi_multi_tbl_temp';
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
 * @properties={typeid:24,uuid:"D37A6AD2-3EA3-4BCB-9C55-A5875985321A"}
 */
function process_richiesta_permessi_multi(event, fs) 
{
	try 
	{
		var numGiorni = fs.getSize();
		
		// verifica possesso modulo comunicazioni
		//var hasModuleCom = globals.ma_utl_hasModule(globals.Module.COMUNICAZIONI);
		
		// verifica richieste precedenti già inserite
		var bloccaInserimento = false;
		var msg = "Esistono le seguenti richieste già inserite nei giorni indicati: <br/>"
		
		/** @type {JSFoundSet<db:/ma_anagrafiche/lavoratori_giustificativirighe>}*/
		var fsPrec = globals.ottieniRichiesteLavoratoriDalAl(vArrIdLavoratore, vDal, vAl);
		if (fsPrec) {
			for (var rl = 1; rl <= fsPrec.getSize(); rl++) {
				fsPrec.setSelectedIndex(rl);
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
					if (fsPrec.giornointero == 1)
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
				msg += fsPrec.giornointero != 1 ? " , ore " + fsPrec.ore : ' per l\'intera giornata';
				msg += fsPrec.giornointero != 1 ? "dalle " + globals.dateFormat(fsPrec.dalleore,globals.OREMINUTI_DATEFORMAT) 
						                          + " alle " + globals.dateFormat(fsPrec.alleore, globals.OREMINUTI_DATEFORMAT) : "";
				msg += "<br/>";
				msg += "per il dipendente : Codice " + globals.getCodLavoratore(fsPrec.idlavoratore) + " - " + globals.getNominativo(fsPrec.idlavoratore);
				msg += "<br/>";
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
		
		// nel caso di giorno non intero, il calcolo del numero di ore per l'evento non può che 
		// basarsi sul calcolo diretto, senza tenere conto di verifiche su fasce o turni nella giornata
		if (!rec['intero'])
		{
			var _dalleOre = rec['dalleore'].getHours() * 100 + rec['dalleore'].getMinutes();
			var _alleOre = rec['alleore'].getHours() * 100 + rec['alleore'].getMinutes();
			rec['oreevento'] = globals.calcolaOreEventoDiretto(_dalleOre, _alleOre);
		}
		
		// UNICA TRANSAZIONE
		databaseManager.startTransaction();
		
		/** @type {JSFoundSet<db:/ma_anagrafiche/lavoratori>}*/
		var fsLav = databaseManager.getFoundSet(globals.Server.MA_ANAGRAFICHE, globals.Table.LAVORATORI);
		
		if (fsLav.find()) {
			fsLav.idlavoratore = vArrIdLavoratore;
			var fsLavSize = fsLav.search();
			if (fsLavSize) 
			{
				for(var l = 1; l <= fsLavSize; l++)
				{
					var fsTesta = fsLav.getRecord(l).lavoratori_to_lavoratori_giustificativitesta;
	
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
						rec['idevento'] = globals.utilizzaSmaltimentoRatei(globals.getDitta(fsLav.idlavoratore)) ? globals.getIdEvento('PD') : globals.getIdEvento('F');
						
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
						
						//Ticket #15325
						recRiga.proprieta = '' //globals.getProprietaPredefinitaEvento(globals.getClasseEvento(rec['idevento']));
						
						recRiga.ore = !rec['intero'] ? rec['oreevento'] : 0;
						recRiga.importo = 0;
					
						// controllo valore del campo ore in caso di giorno non intero
						if(recRiga.ore == null)
							throw new Error('Errore durante il calcolo delle ore di permesso per il giorno ' + globals.dateFormat(recRiga.giorno,globals.EU_DATEFORMAT) + '...')
					}
				}
			}
		}
		else 
			throw new Error('Funzionalità al momento non disponibile');				
		
		// inserimento valori richiesta
		var success = databaseManager.commitTransaction();
		if (!success) {
			var failedrecords = databaseManager.getFailedRecords();
			
			databaseManager.rollbackTransaction(true);
								
			if (failedrecords && failedrecords.length > 0) {
				for (var f = 0; f < failedrecords.length; f++)
					application.output(failedrecords[f].exception.getErrorCode() + ' - ' + failedrecords[f].exception.getMessage(), LOGGINGLEVEL.WARNING);
			}
			
			throw new Error('Errore durante il salvataggio della richiesta. Provare a rieffettuare l\'inserimento o contattare il servizio di assistenza ');
		}
		
		// verifica del corretto inserimento dei dati della richiesta nel database
//		var idLavoratoreGiustificativoTesta = -1;
//		idLavoratoreGiustificativoTesta = newTesta.idlavoratoregiustificativotesta;
//		if(!(idLavoratoreGiustificativoTesta instanceof Number))
//		{
//			throw new Error("Errore in fase di inserimento della richiesta. Provare a rieffettuare l\'inserimento o contattare il servizio di assistenza");
//		}

		// verificare se così il dato è sempre presente
		databaseManager.refreshRecordFromDatabase(newTesta,-1);
				
		// aggiornamento visualizzazione situazione richieste
		globals.ma_utl_setStatus(globals.Status.BROWSE, controller.getName());
		globals.svy_mod_closeForm(event);
		
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