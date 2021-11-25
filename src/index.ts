import { DWRequestPromiseExtension } from "./types/DW_Request_Promise_Extension";
import * as DWRest from "./types/DW_Rest";
import polly from "polly-js";
import { RestCallWrapper } from "./restWrapper";

const timeToWait: number = 60 * 1000; //MS

console.info('app runs')

//connection data
const rootUrl = "http://localhost/";
const user = "dwadmin";
const password = "admin";
const organization_forLogon = "Peters Engineering";
const hostID = "7b5ed19b-bfd6-46e9-8a3b-efd2a4499666"; //has to be unique per machine
const fileCabinetID = "22b893c3-a3f6-4de5-923b-92011ecfae91";
const docId = 7;

//the REST Wrapper
const restWrapper: RestCallWrapper = new RestCallWrapper(rootUrl);

//Create Login Model
const logonModel: DWRest.ILogonModel = restWrapper.CreateLogonModel(
  user,
  password,
  organization_forLogon,
  hostID
);

//Polly is a library for retrying on errors. In our example we will react on "TooManyRequests"
polly()
  .handle((error: DWRequestPromiseExtension.IStatusCodeError) => {
    //Check for 'TooManyRequests'
    if (error.statusCode === 429) {
      console.warn(
        `Throttling active, waiting for ${
          timeToWait / 1000
        } seconds and trying again.`
      );
      return true;
    }

    return false;
  })
  .waitAndRetry([timeToWait])
  .executeForPromise(async () => {
    console.info(`Signing out`)
    const logoffResponse: DWRest.ILogoffResponse = await restWrapper.Logoff();
    console.info(`DW version: ${logoffResponse.Version}`);

    console.info(`Signing in to ${rootUrl} as ${user}`)
    //#region Login, list organizations and filecabinets
    const logonResponse: DWRest.ILogonResponse = await restWrapper.Logon(logonModel);

    // console.info(`GetOrganization`)
    // const organization: DWRest.IOrganization = await restWrapper.GetOrganization();
    // console.info(organization);

    console.info(`GetFileCabinet`)
    const fileCabinet: DWRest.IFileCabinet = await restWrapper.GetFileCabinet(fileCabinetID);
    // console.info(fileCabinet);
    
    console.info(`GetDocumentByDocID`)
    const specificDocument: DWRest.IDocument = await restWrapper.GetDocumentByDocID(fileCabinet, docId);
    // console.info(specificDocument);
    console.info(`SectionCount: ${specificDocument.SectionCount}`);

    // console.info(`GetSections`)
    // const sections: DWRest.ISection[] = await restWrapper.GetSections(specificDocument);
    // console.info(sections);

    // Replace a file (section)
    ///////////////////////////
    // if (specificDocument.Sections && specificDocument.Sections.length > 0) {
    //   const sparseSection: DWRest.ISection = specificDocument.Sections[0];
    //   // console.info(sparseSection);
    //   console.info(`Load full section`);
    //   const fullSection: DWRest.ISection = await restWrapper.LoadFullObjectFromPlatform<DWRest.ISection>(sparseSection);
    //   // console.info(fullSection);
    //   console.info(`Update section`);
    //   const updatedSection: DWRest.ISection = await restWrapper.EditDocumentSection(fullSection, 'uploads/pm-meldung-version1.pdf')
    //   // const updatedSection: DWRest.ISection = await restWrapper.EditDocumentSection(fullSection, 'uploads/version2.pdf')
    //   console.info(updatedSection);

    //   console.info(`GetDocumentByDocID`)
    //   const specificDocument2: DWRest.IDocument = await restWrapper.GetDocumentByDocID(fileCabinet, 7);
    //   console.info(specificDocument2);
    //   console.info(`SectionCount: ${specificDocument2.SectionCount}`);
    // }

    // Add a file to a document
    ///////////////////////////
    // console.info(`Upload anhang1`);
    // const upload1 = await restWrapper.UploadFile(specificDocument, 'uploads/anhang1.docx');
    // console.info(upload1);
    // console.info(`Upload anhang2`);
    // const upload2 = await restWrapper.UploadFile(specificDocument, 'uploads/anhang2.xlsx');
    // console.info(upload2);

    // Erfolgskontrolle
    // console.info(`GetDocumentByDocID`)
    // const specificDocument2: DWRest.IDocument = await restWrapper.GetDocumentByDocID(fileCabinet, 7);
    // console.info(specificDocument2);
    // console.info(`SectionCount: ${specificDocument2.SectionCount}`);

    // Download, falls gewünscht
    const downloadPath: string = await downloadDocument(specificDocument);
    console.info(downloadPath);
  })
  .catch((error: Error) => {
    traceError(error);
  });

async function downloadDocument(document: DWRest.IDocument) {
  const fullLoadedDocument: DWRest.IDocument = await restWrapper.LoadFullObjectFromPlatform<DWRest.IDocument>(document);
  const downloadPath: string = await restWrapper.DownloadDocument(
    fullLoadedDocument,
    true,
    DWRest.TargetFileType.PDF
  );

  return downloadPath;
}

/**
 * Traces error
 *
 * @param {Error} error
 */
 function traceError(error: Error) {
  console.error(
    "Error message:\n\r" + error.message + "\n\rError Stack:\n\r" + error.stack
  );
}
