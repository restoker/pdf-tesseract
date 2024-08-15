import { useState } from "react";
import { PDFDocument } from 'pdf-lib'
import Tesseract from 'tesseract.js';
import Loading from "./components/Loading";
// import { fromPath } from "pdf2pic";

function App() {
  const [archivo, setArchivo] = useState(undefined);
  const [archivoFinalPdf, setArchivoFinalPdf] = useState(undefined);
  const [imageninput, setImageninput] = useState(undefined);
  const [imagenesinput, setImagenesinput] = useState(undefined)
  const [splitPdfs, setSplitPdfs] = useState([]);
  const [splitPdfsParts, setSplitPdfsParts] = useState([]);
  const [splitparPdfs, setSplitparPdfs] = useState([]);
  const [archivoPar, setArchivoPar] = useState(undefined);
  const [pdfsName, setpdfsName] = useState([]);
  const [loading, setLoading] = useState(false);
  // const [namesPages, setNamesPages] = useState([]);

  const obtenerPdf = (e) => {
    // console.log(e.target.value);
    setArchivo(e.target.files[0])
    // console.log(e.target.files[0]);
    // // crear un documento nuevo, para poder copiar paginas en el 
  }

  const obtenerPdfPares = (e) => {
    setArchivoPar(e.target.files[0])
  }

  const obtenerPdfFinal = (e) => {
    setArchivoFinalPdf(e.target.files[0])
  }

  const obtenerImagen = (e) => {
    setImageninput(e.target.files[0]);
  }

  const obtenermultiImagen = (e) => {
    // console.log(e.target.files);
    setImagenesinput(e.target.files);
  }

  function readFileAsync(file) {
    return new Promise((resolve, reject) => {
      let reader = new FileReader();
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    })
  }

  // function download(file, filename, type) {
  //   const link = document.getElementById('link');
  //   link.download = filename;
  //   let binaryData = [];
  //   binaryData.push(file);
  //   link.href = URL.createObjectURL(new Blob(binaryData, { type: type }))
  // }

  const dividirPDf = async () => {
    // cargar pdf
    if (!archivo) return;
    // cargar archivo pdf
    let binaryData = [];
    try {
      const pdfBytes = await readFileAsync(archivo);

      // Load the PDF document without updating its existing metadata
      const pdfDoc = await PDFDocument.load(pdfBytes);
      const numeroPaginas = pdfDoc.getPages().length;

      // console.log(pdfDoc.context.header.toString());

      for (let i = 0; i < (numeroPaginas / 3); i += 1) {
        // Crea un nuevo documento
        const subDocument = await PDFDocument.create();

        const [p1, p2, p3] = await subDocument.copyPages(pdfDoc, [3 * i, 3 * i + 1, 3 * i + 2]);//importante: "indices de las paginas comiensan en 0"

        // page1.drawPage()

        // console.log(copiedPages);
        // p1.setWidth(250);
        // p2.setWidth(250);
        // p3.setWidth(250);
        subDocument.addPage(p1);
        subDocument.addPage(p2);
        subDocument.addPage(p3);
        // subDocument.addPage([p1, p2, p3]);
        // // console.log(subDocument);
        const pdfBytes = await subDocument.save();
        // const pages = subDocument.getPages();

        // console.log(pdfBytes);
        // const png2 = await pdfToPng(pages[2], { viewportScale: 1.0 });

        // const blobToBase64 = imagen => {
        //   const reader = new FileReader();
        //   reader.readAsDataURL(imagen);
        //   return new Promise(resolve => {
        //     reader.onloadend = () => {
        //       resolve(reader.result);
        //     };
        //   });
        // };
        // const blobImage = new Blob([pages[1]], { type: 'image/jpeg' });
        // const imagen = await blobToBase64(blobImage);
        // console.log(imagen);
        // download(pdfBytes, `file-${i + 1}.pdf`, 'application/pdf');
        binaryData = [...binaryData, pdfBytes];
        // binaryData = [...binaryData, pdfBytes];

        // crear pdf
        // URL.createObjectURL(new Blob(binaryData, { type: type }))
      }
      // console.log(binaryData);
      setSplitPdfs(binaryData);

    } catch (e) {
      console.error(e);
    }
  }

  const dividirPDftoPares = async () => {
    // cargar pdf
    if (!archivoPar) return;
    // cargar archivo pdf
    // let binaryData = [];
    try {
      const pdfBytes = await readFileAsync(archivoPar);
      // Load the PDF document without updating its existing metadata
      const pdfDoc = await PDFDocument.load(pdfBytes);
      console.log(pdfDoc);
      const numeroPaginas = pdfDoc.getPages().length;

      // console.log(pdfDoc.context.header.toString());

      const subDocument = await PDFDocument.create();
      for (let i = 0; i < (numeroPaginas / 3); i += 1) {
        // Crea un nuevo documento
        const [p2] = await subDocument.copyPages(pdfDoc, [3 * i + 1]);//importante: "indices de las paginas comiensan en 0"
        subDocument.addPage(p2);
        // download(pdfBytes, `file-${i + 1}.pdf`, 'application/pdf');
        // binaryData = [...binaryData, pdfBytes];
        // crear pdf
        // URL.createObjectURL(new Blob(binaryData, { type: type }))
      }
      const pdfBytes2 = await subDocument.save();
      // console.log(binaryData);
      // const pdfDAtaUri = await subDocument.saveAsBase64({ dataUri: true })
      setSplitparPdfs(pdfBytes2);

    } catch (e) {
      console.error(e);
    }
  }

  const procesarImagen = async () => {
    if (!imageninput) return;
    // const pdfBytes = await readFileAsync(imageninput);
    Tesseract.recognize(
      imageninput,
      'spa',
      {
        // logger: m => console.log(m) 
      }
    ).then(({ data }) => {
      // console.log(data);
      // console.log(text.toString());
      // console.log(data.lines[8].text.slice(20));
      // console.log(data.lines[9].text.slice(15));
      // console.log(data.lines[11].text.slice(13));
      console.log(`${data.lines[9].words[4].text} - ${data.lines[8].words[3].text} ${data.lines[8].words[4].text} ${data.lines[8].words[5]?.text || ''} ${data.lines[8].words[6]?.text || ''} ${data.lines[8].words[7]?.text || ''} - ${data.lines[11].words[2]?.text} ${data.lines[11].words[3]?.text} ${data.lines[11].words[4]?.text || ''} ${data.lines[11].words[5]?.text || ''} ${data.lines[11].words[6]?.text || ''}`);
      // text.
    })
  }

  const dividirPDfAndRename = async (datosTrabajadores) => {
    // cargar pdf
    if (!archivoFinalPdf) return;
    // if (!datosTrabajadores) return;
    // console.log(datosTrabajadores);

    // cargar archivo pdf

    let binaryData = [];
    try {
      const pdfBytes = await readFileAsync(archivoFinalPdf);
      // Load the PDF document without updating its existing metadata
      const pdfDoc = await PDFDocument.load(pdfBytes);
      const numeroPaginas = pdfDoc.getPages().length;
      // console.log(pdfDoc.context.header.toString());
      for (let i = 0; i < (numeroPaginas / 3); i += 1) {
        // Crea un nuevo documento
        const subDocument = await PDFDocument.create();
        const [p1, p2, p3] = await subDocument.copyPages(pdfDoc, [3 * i, 3 * i + 1, 3 * i + 2]);//importante: "indices de las paginas comiensan en 0"
        subDocument.addPage(p1);
        subDocument.addPage(p2);
        subDocument.addPage(p3);
        // subDocument.addPage([p1, p2, p3]);
        // // console.log(subDocument);
        const pdfBytes = await subDocument.save();
        // const pages = subDocument.getPages();

        binaryData = [...binaryData, { pdfBytes, ...(datosTrabajadores[i]) }];
        // binaryData = [...binaryData, pdfBytes];
        // crear pdf
      }
      // console.log(binaryData);
      setSplitPdfsParts(binaryData);
    } catch (e) {
      console.error(e);
    }
  }

  // const imprimir = async () => {
  //   console.log('me imprimi');
  // }

  const procesarImagenes = async () => {
    if (!imagenesinput) return;
    // if (!archivoFinalPdf) return;

    // convertir archivo de tipo FileList a Array
    const imagenes = [...imagenesinput];

    // console.log(imagenes);
    let finalExtractData = [];
    // prueva del consepto
    const a = imagenes.map(async (imagen, index) => {
      const { data } = await Tesseract.recognize(
        imagen,
        'spa',
        {
          // logger: m => {
          //   // console.log(m)
          // }
        }
      );
      let informacion = {};
      if (data) {
        for (let i = 0; i < data.lines.length; i++) {
          // const element = array[i];
          // console.log(data);
          const istextTrue = data.lines[i].text.includes('NOMBRES Y APELLIDOS')
          if (istextTrue) {
            informacion.id = index;
            informacion.nombre = data.lines[i].text.replace('NOMBRES Y APELLIDOS', '').replace("|", '').replace("\n", '').replace(":", "").replace("'", "").replace("!", "").slice(1).trimStart().toUpperCase();
            // console.log(informacion.nombre);
          }
          const istextTrue2 = data.lines[i].text.includes('APELLIDOS Y NOMBRES')
          if (istextTrue2) {
            informacion.id = index;
            informacion.nombre = data.lines[i].text.replace('APELLIDOS Y NOMBRES', '').replace("|", '').replace("\n", '').replace(":", "").replace("'", "").replace("!", "").slice(1).trim().toUpperCase();
            // console.log(informacion.nombre);
          }
          const isTrueDNI = data.lines[i].text.includes('Número de DNI');
          if (isTrueDNI) {
            informacion.dni = data.lines[i].text.replace('Número de DNI', '').replace("\n", '').replace(":", "").replace("|", '').replace(";", '').replace("f", '').replace("-", '').replace("_", '').replace("y", '').replace("W", '').replace("i", '').slice(1).trim();
          }
          const isTrueDNI2 = data.lines[i].text.includes('Numero de DNI');
          if (isTrueDNI2) {
            informacion.dni = data.lines[i].text.replace('Numero de DNI', '').replace("\n", '').replace(":", "").replace("|", '').replace(";", '').replace("f", '').replace("-", '').replace("_", '').replace("y", '').replace("W", '').replace("i", '').slice(1).trim();
          }
          const isTrueEmpresa = data.lines[i].text.includes('RAZON SOCIAL');
          if (isTrueEmpresa) {
            informacion.empresa = data.lines[i].text.replace('RAZON SOCIAL', '').replace("\n", '').replace(":", "").replace("|", '').replace('GAS', 'G4S').replace('GaS', 'G4S').replace('G4s', 'G4S').replace('GAs', 'G4S').replace('Gas', 'G4S').replace('GA4S', 'G4S').replace('Ga4s', 'G4S').replace('GaAs', 'G4S').replace('G45', 'G4S').replace('5.A.', 'S.A.').replace('M8S', 'M&S').replace('GEOTECSA', 'GEOTEC SA').replace('M8RC', 'M&RC').replace('M8_S', 'M&S').replace('M8_RC', 'M&RC').replace('i', '').replace("'", '').slice(1).trim();
            break;
          }
        }
        finalExtractData = [...finalExtractData, informacion];
      }
      return informacion;
    });
    // console.log(a);
    const losDatos = await Promise.all(a);
    // console.log(losDatos);
    await dividirPDfAndRename(losDatos);

    // CORRECTO INIT

    // for (const [index, imagen] of imagenes.entries()) {
    //   const { data } = await Tesseract.recognize(
    //     imagen,
    //     'spa',
    //     {
    //       logger: m => {
    //         // console.log(m)
    //       }
    //     }
    //   );
    //   // console.log(data);
    //   if (data) {
    //     let informacion = {};
    //     for (let i = 0; i < data.lines.length; i++) {
    //       // const element = array[i];
    //       const isTrue = data.lines[i].text.includes('NOMBRES Y APELLIDOS:');
    //       if (isTrue) {
    //         informacion.id = index;
    //         informacion.nombre = data.lines[i].text.replace('NOMBRES Y APELLIDOS', '').replace("|", '').replace("\n", '').replace(":", "").trimStart();
    //       }
    //       const isTrueDNI = data.lines[i].text.includes('Número de DNI');
    //       if (isTrueDNI) {
    //         informacion.dni = data.lines[i].text.replace('Número de DNI', '').replace("\n", '').replace(":", "").trimStart();
    //       }
    //       const isTrueEmpresa = data.lines[i].text.includes('RAZON SOCIAL');
    //       if (isTrueEmpresa) {
    //         informacion.empresa = data.lines[i].text.replace('RAZON SOCIAL', '').replace("\n", '').replace(":", "").replace("|", '').trimStart();
    //         break;
    //       }
    //     }
    //     finalExtractData = [...finalExtractData, informacion];
    //   }


    //   if (imagenes.length === index + 1) {
    //     await imprimir();
    //     // return finalExtractData;
    //   }
    // }

    // await dividirPDfAndRename(finalExtractData);


    //END CORRECT


    // const scheduler = createScheduler();
    // for (const [index, imagen] of imagenes.entries()) {

    //   const worker = createWorker();

    //   (async () => {
    //     await worker.load();
    //     await worker.loadLanguage('spa');
    //     await worker.initialize('spa');
    //     const { data } = await worker.recognize(imagen);
    //     let informacion = {};
    //     for (let i = 0; i < data.lines.length; i++) {
    //       const isTrue = data.lines[i].text.includes('NOMBRES Y APELLIDOS:');
    //       if (isTrue) {
    //         informacion.id = index;
    //         informacion.nombre = data.lines[i].text.replace('NOMBRES Y APELLIDOS', '').replace("|", '').replace("\n", '').replace(":", "").trimStart();
    //       }
    //       const isTrueDNI = data.lines[i].text.includes('Número de DNI');
    //       if (isTrueDNI) {
    //         informacion.dni = data.lines[i].text.replace('Número de DNI', '').replace("\n", '').replace(":", "").trimStart();
    //       }
    //       const isTrueEmpresa = data.lines[i].text.includes('RAZON SOCIAL');
    //       if (isTrueEmpresa) {
    //         informacion.empresa = data.lines[i].text.replace('RAZON SOCIAL', '').replace("\n", '').replace(":", "").replace("|", '').trimStart();
    //         scheduler.addJob(`job-${i}`)
    //         break;
    //       }
    //     }
    //     finalExtractData = [...finalExtractData, informacion];
    //     console.log(finalExtractData);
    //     await worker.terminate();
    //   })();
    //   console.log(finalExtractData);
    // }


    //TODO: dividir los pdfs en 3 partes y usar el final extract data
    // imprimir();
    // return finalExtractData;
  }

  const procesadoDeImagenAndPdf = async () => {
    setLoading(true);
    try {
      await procesarImagenes();
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
    // dividirPDfAndRename()
  }

  // console.log(splitPdfs);


  const obtenerFileNames = (e) => {
    // console.log(e.target.files);
    const listPdfs = Array.from(e.target.files);
    // console.log(listPdfs);
    let newFiles = [];
    for (const pdfs of listPdfs) {
      console.log(pdfs.name);
      newFiles = [...newFiles, String(pdfs.name)];
    }
    console.log(newFiles);
    setpdfsName(newFiles);
    // console.log(pdf);
    // console.log(pdfsName);
  }

  const obtenerNombresPdf = () => {
    console.log(pdfsName);
  }

  return (
    <div className="flex flex-col px-10 py-10 max-w-7xl">
      {loading && <Loading />}
      <h1 className="font-extrabold text-indigo-500 text-4xl mb-5">Conversor:</h1>
      <div className="flex flex-col max-w-md border-slate-500 border-[1px] py-3 px-3 mb-3 rounded-md">
        <input
          type="file"
          name="documento"
          id="documento"
          placeholder="Ingrese su documento aqui"
          onChange={obtenerPdf}
        />
        <button
          className="inline-block items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 mt-5 md:w-52 self-center"
          onClick={dividirPDf}
        >
          Dividir a 3 pdf
        </button>
        <p id="link" className="text-lg">download: </p>
        <div className="my-3">
          <ul className="flex flex-col">
            {splitPdfs.length > 0 && splitPdfs.map((pdf, i) => (
              <a
                key={`key-${i}`}
                href={URL.createObjectURL(new Blob([pdf], { type: 'application/pdf' }))}
                download={`file-${i + 1}.pdf`}
              >file-{i + 1}.pdf</a>
            ))}
          </ul>
        </div>
      </div>

      <div
        className="flex flex-col max-w-md border-slate-500 border-[1px] py-3 px-3 mb-3 rounded-md"
      >
        <p className="text-sm py-3">obtiene las paginas(pares) que contienen el "Informe de resultado"</p>
        <input
          type="file"
          name="documento"
          id="documento"
          placeholder="Ingrese su documento aqui"
          onChange={obtenerPdfPares}
        />
        <button
          className="inline-block items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 mt-5 md:w-52 self-center"
          onClick={dividirPDftoPares}
        >
          obtener pares
        </button>
        {/* <p id="link" className="text-lg">download: </p>
        <div className="my-3">
          <ul className="flex flex-col">
            {splitparPdfs.length > 0 && splitparPdfs.map((pdf, i) => (
              <a
                key={`key-${i}`}
                href={URL.createObjectURL(new Blob([pdf], { type: 'application/pdf' }))}
                download={`file-${i + 1}.pdf`}
              >file-{i + 1}.pdf</a>
            ))}
          </ul>
        </div> */}
        {splitparPdfs.length > 0 && <a href={URL.createObjectURL(new Blob([splitparPdfs], { type: 'application/pdf' }))} download={`files-par.pdf`}>descargar Imagenes pares</a>}
      </div>

      <div className="flex flex-col max-w-md border-slate-500 border-[1px] py-3 px-3 mb-3 rounded-md">
        <p className="text-sm py-3">obtener datos de una imagen</p>

        <input
          type="file"
          name="documento"
          id="documento"
          placeholder="Traducir imagen"
          onChange={obtenerImagen}
        />
        <button
          className="inline-block items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 mt-5 md:w-52 self-center"
          onClick={procesarImagen}
        >
          Obtener datos imagen
        </button>
      </div>

      <div className="flex flex-col w-auto border-slate-500 border-[1px] py-3 px-3 mb-3 rounded-md">
        <p className="text-sm py-3">obtener datos de multiples imagenes</p>
        <div className="flex flex-wrap flex-col md:flex-row">
          <div className="flex flex-col border-[1px] border-slate-500 lg:mr-10 p-5 flex-1">
            <label htmlFor="documento">Ingrese sus <span className="font-bold">Imagenes</span> Aqui</label>
            <input
              type="file"
              name="documento"
              id="documento"
              placeholder="Traducir imagen"
              multiple
              onChange={obtenermultiImagen}
            />
          </div>
          <div className="flex flex-col border-[1px] border-slate-500 p-5 flex-1">
            <label htmlFor="documento">ingrese el <span className="font-bold">pdf</span> aqui</label>
            <input
              type="file"
              name="documento"
              id="documento"
              placeholder="Traducir imagen"
              onChange={obtenerPdfFinal}
            />
          </div>
        </div>
        {/* <button
          className="block bg-red-400 text-white my-3"
          onClick={procesarImagenes}
        >
          Obtener datos imagenes
        </button> */}
        <button
          type="button"
          className="inline-block items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mt-5 md:w-64 self-center"
          onClick={procesadoDeImagenAndPdf}
        >
          Procesar pdf
        </button>
        <p id="link" className="text-lg">download: </p>
        <div className="my-3">
          <ul className="flex flex-col">
            {splitPdfsParts.map((parte, i) => (
              // console.log(parte)
              <a
                key={`key-${i}`}
                href={URL.createObjectURL(new Blob([parte.pdfBytes], { type: 'application/pdf' }))}
                download={`${parte.dni}-${parte.nombre}-${parte.empresa}-ERGONOMIC-TAMIZAJE Y PRUEBA ANTIGENA-${new Date().toLocaleString('en-GB').slice(0, 10)}.pdf`}
                className='hover:text-indigo-500 visited:text-green-300'
              >file-{i + 1}-{parte.nombre}</a>
              //   <a
              //   key={`key-${i}`}
              //   href={URL.createObjectURL(new Blob([parte.pdfBytes], { type: 'application/pdf' }))}
              //   download={`${parte.dni}-${parte.nombre}-${parte.empresa}-ergonomic-tamizaje y prueba antigena-${new Date().toLocaleString('en-GB').slice(0, 10).split("/").join('-')}.pdf`}
              // >file-{parte.nombre}</a>
            ))}
          </ul>
        </div>
      </div>

      <div className="flex flex-col max-w-md border-slate-500 border-[1px] py-3 px-3 mb-3 rounded-md">
        <p className="text-sm py-3">obtener nombre de archivos</p>

        <div className="flex flex-col border-[1px] border-slate-500 lg:mr-10 p-5 flex-1">
          <label htmlFor="documento">Ingrese sus <span className="font-bold">Imagenes</span> Aqui</label>
          <input
            type="file"
            name="documento"
            id="documento"
            placeholder="Traducir imagen"
            multiple
            onChange={obtenerFileNames}
          />
        </div>
        <button
          className="inline-block items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 mt-5 md:w-52 self-center"
          onClick={obtenerNombresPdf}
        >
          Obtener datos imagen
        </button>
      </div>
      <div className="text-sm">
        <ul>
          {pdfsName.map((pdf, i) => (
            <li className="">
              {i}- {pdf}
              {/* 📜{pdf} */}
            </li>
          ))}
        </ul>
      </div>
    </div >
  );
}

export default App;
