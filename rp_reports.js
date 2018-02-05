/**
 * Lancia la stampa della situazione delle richieste ferie e permessi nel periodo specificato
 * generando un file pdf di riepilogo
 * 
 * @param {Array<Number>} arrDipendenti
 * @param {Date} dal
 * @param {Date} al
 * @param {Number} [idDitta]
 *
 * @properties={typeid:24,uuid:"925EC19C-A68B-47BE-971E-9E914FE7CA6F"}
 */
function stampaSituazioneRichieste(arrDipendenti,dal,al,idDitta)
{
	try
	{		
			var parameters;
			var reportName = 'RP_RiepilogoRichieste.jasper';
			parameters =
			   {
				   parrlavoratori   :   arrDipendenti,
				   pdal   			:	dal,
				   pal              :   al,
				   pstato           :   0
			   }
			
		    /**
			 * Save additional operation's information
			 */
			var values = 
			{
				op_hash		: utils.stringMD5HashBase64(_to_sec_user$user_id.user_id + dal.toString()),
				op_ditta	: idDitta != null ? idDitta : globals.getDitta(arrDipendenti[0]),
				op_message	: globals.getNumMese(dal.getMonth() + 1) + '/' + dal.getFullYear(),
				op_periodo 	: dal.getFullYear() * 100 + dal.getMonth() + 1
			};
				
			globals.startAsyncOperation
			(
				 globals.createReport
				,[
					globals.Server.MA_ANAGRAFICHE
					,parameters
					,reportName
					,[['RiepilogoRichiesteDal', utils.dateFormat(dal,globals.ISO_DATEFORMAT),'Al', utils.dateFormat(al,globals.ISO_DATEFORMAT)].join('_'),'pdf'].join('.')
				 ]
				, null
				, null
				, globals.OpType.SRR
				,values	
			);
								  
	}
	catch(ex)
	{
		globals.ma_utl_logError(ex);
	}
	
}

/**
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"387C7A45-2167-4A94-878E-750328840484"}
 */
function exportExcel_VC(event)
{
	try
	{
		var frm = forms[event.getFormName()];
		var fs = frm.foundset;
				
		var vDate = new Date();
		var values = 
		{
			op_hash		: utils.stringMD5HashBase64(vDate.toString()),
			op_ditta	: globals.getDitta(fs.getRecord(1)['idlavoratore']),
			op_message	: 'Esportazione in corso...',
			op_periodo 	: utils.dateFormat(vDate, globals.PERIODO_DATEFORMAT)
		};
		
		globals.startAsyncOperation
		(
			 createExcelFile_VC,
			 [fs,new Date(),new Date()],
			 null,
			 null,
			 globals.OpType.EWEA,
			 values
		);
		
		
	}
	catch(ex)
	{
		application.output(ex,LOGGINGLEVEL.ERROR);
	}
}

/**
 * @AllowToRunInFind
 * 
 * Popola e genera il file excel con i dati richiesti
 *
 * @param {JSFoundset} fs
 * @param {Date} dateFrom
 * @param {Date} dateTo
 * @param {JSRecord<db:/ma_log/operationlog>} operation
 *
 * @properties={typeid:24,uuid:"4F716588-2971-4F74-A607-989959163B28"}
 * @SuppressWarnings(wrongparameters)
 */
function createExcelFile_VC(fs, dateFrom, dateTo, operation)
{
	try
	{
		// LOG per inizio recupero dati
		operation.op_message = 'Inizio estrazione dati';
		operation.op_end = new Date();
		operation.op_status = globals.OpStatus.ONGOING;
		operation.op_progress = 10;
		
		var fileName = ['Riepilogo_Assenze_Dal'
		                ,globals.dateFormat(dateFrom,globals.ISO_DATEFORMAT)
						,'Al'
						, globals.dateFormat(dateTo,globals.ISO_DATEFORMAT)
		                ].join('_');
		var localFile = true;
		/** @type {Array<byte>} */
		
		var template = plugins.file.readFile('C:/Report/RP_VisualizzaCopertura.xls');

		var ds = databaseManager.createEmptyDataSet();
		
		ds.addColumn('codice');
		ds.addColumn('nominativo');
		
		for(var r = 1; r < fs.getSize(); r++)
		{
			var arrRow = [];
			arrRow.push(fs.getRecord(r)['codice']);
			arrRow.push(fs.getRecord(r)['nominativo']);
			
			for(var c = 3; c < fs.alldataproviders.length; c++)
			{
				if(utils.stringLeft(fs.alldataproviders[c],4) == 'calc')
				{
					if(r == 1)
						ds.addColumn(utils.stringRight(fs.alldataproviders[c],8));
					arrRow.push(fs.getRecord(r)[fs.alldataproviders[c]]);
				}
			}
			
			ds.addRow(arrRow);
		}
		
		var bytes = globals.xls_export(ds,fileName,localFile,false,true,null,'Visualizzazione assenze',template);
		
		ds.removeRow(-1);
		
		if(!bytes || bytes.length == 0)
			return false;
		
		databaseManager.startTransaction();
		
		if(!globals.saveFile(operation, bytes, fileName + '.csv', globals.MimeTypes.CSV))
			throw 'Errore durante il salvataggio del file';
		
		operation.op_message = 'Esportazione completata con successo';
		operation.op_end = new Date();
		operation.op_status = globals.OpStatus.SUCCESS;
		operation.op_progress = 100;
				
		return true;
	}
	catch(ex)
	{
		application.output(ex, LOGGINGLEVEL.ERROR);
		
		if(operation)
		{
			operation.op_end = new Date();
			operation.op_status = globals.OpStatus.ERROR;
			operation.op_progress = 0;
			operation.op_message = 'Errore durante l\'esportazione dei dati' + (ex && (': ' + ex));
		}
		
		return false;
	}
	finally
	{
		/**
		 * Remove all created files and commit the transaction
		 */
		plugins.file.deleteFolder(globals.SERVER_TMPDIR.replace(/\\/g,'/') + '/export/', false);
		databaseManager.commitTransaction();
		
		var retObj = {status : operation};
		forms.mao_history.checkStatusCallback(retObj);
		forms.mao_history.operationDone(retObj);
	}
}