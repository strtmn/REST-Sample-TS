# DocuWare REST API Playground

Erweiterung des [DocuWare REST API Samples](https://github.com/DocuWare/REST-Sample-TS).

Das Hauptanliegen war, eine Datei zu ersetzen, bzw. einem DocuWare-Dokument neue Dateien hinzuzufügen.
Die Mission war erfoglreich, das Sample wurde erweitert um:

- Diese Anwendung tut sinnvolles, anstatt nur alle möglichen Methoden aufzurufen.
- Add `restWrapper.Logoff()`
- Add `restWrapper.GetSections()`
- Add `restWrapper.UploadFile()`: fügt einem DW-Dokument eine weitere Datei hinzu
- Ersetzen (`restWrapper.EditDocumentSection()`):
  - ersetzt eine Datei in einem DW-Dokument
  - in `index.ts` aufgenommen.

Die originale Readme-Datei heißt jetzt [README-orig.md](README-orig.md).

Ganz warme Empfehlung: die [DocuWare Postman Collection](https://developer.docuware.com/rest/examples/postman-collection-download.html).