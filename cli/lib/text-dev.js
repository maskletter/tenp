
const fs = require('fs');
const ts = require('typescript');
const path = require('path');
const cwd = process.cwd();

/** Generate documentation for all classes in a set of .ts files */
function generateDocumentation(fileNames, options){
  // Build a program using the set of root file names in fileNames
  let program = ts.createProgram(fileNames, options);

  // Get the checker, we will use it to find more about classes
  let checker = program.getTypeChecker();

  let output = [];

  // Visit every sourceFile in the program
  for (const sourceFile of program.getSourceFiles()) {
    if (!sourceFile.isDeclarationFile) {
      // Walk the tree to search for classes
      ts.forEachChild(sourceFile, visit);
    }
  }

  // print out the doc
  // fs.writeFileSync("classes.json", JSON.stringify(output, undefined, 4));
  console.log(JSON.stringify(output, undefined, 4))
  return;

  /** visit nodes finding exported classes */
  function visit(node) {
    // Only consider exported nodes
    if (!isNodeExported(node)) {
      return;
    }

    if (ts.isClassDeclaration(node) && node.name) {
      // This is a top level class, get its symbol
      let symbol = checker.getSymbolAtLocation(node.name);
      if (symbol) {
        output.push(serializeClass(symbol));
      }
      // No need to walk any further, class expressions/inner declarations
      // cannot be exported
    } else if (ts.isModuleDeclaration(node)) {
      // This is a namespace, visit its children
      ts.forEachChild(node, visit);
    }
  }

  /** Serialize a symbol into a json object */
  function serializeSymbol(symbol) {
    return {
      name: symbol.getName(),
      documentation: ts.displayPartsToString(symbol.getDocumentationComment()),
      type: checker.typeToString(
        checker.getTypeOfSymbolAtLocation(symbol, symbol.valueDeclaration)
      )
    };
  }

  /** Serialize a class symbol information */
  function serializeClass(symbol) {
    let details = serializeSymbol(symbol);

    // Get the construct signatures
    let constructorType = checker.getTypeOfSymbolAtLocation(
      symbol,
      symbol.valueDeclaration
    );
    details.constructors = constructorType
      .getConstructSignatures()
      .map(serializeSignature);
    return details;
  }

  /** Serialize a signature (call or construct) */
  function serializeSignature(signature) {
    return {
      parameters: signature.parameters.map(serializeSymbol),
      returnType: checker.typeToString(signature.getReturnType()),
      documentation: ts.displayPartsToString(signature.getDocumentationComment())
    };
  }

  /** True if this is visible outside this file, false otherwise */
  function isNodeExported(node) {
    return (
      (ts.getCombinedModifierFlags(node) & ts.ModifierFlags.Export) !== 0 ||
      (!!node.parent && node.parent.kind === ts.SyntaxKind.SourceFile)
    );
  }
}



function watch(rootFileNames, options) {
  const files = {};

  // initialize the list of files
  rootFileNames.forEach(fileName => {
    files[fileName] = { version: 0 };
  });

  // Create the language service host to allow the LS to communicate with the host
  const servicesHost = {
    getScriptFileNames: () => rootFileNames,
    getScriptVersion: fileName =>
      files[fileName] && files[fileName].version.toString(),
    getScriptSnapshot: fileName => {
      if (!fs.existsSync(fileName)) {
        return undefined;
      }

      return ts.ScriptSnapshot.fromString(fs.readFileSync(fileName).toString());
    },
    getCurrentDirectory: () => process.cwd(),
    getCompilationSettings: () => options,
    getDefaultLibFileName: options => ts.getDefaultLibFilePath(options),
    fileExists: ts.sys.fileExists,
    readFile: ts.sys.readFile,
    readDirectory: ts.sys.readDirectory
  };

  // Create the language service files
  const services = ts.createLanguageService(
    servicesHost,
    ts.createDocumentRegistry()
  );
  // generateDocumentation(rootFileNames, options)
  console.log(services)
  return;
  // console.log(rootFileNames)
  // return;
  // Now let's watch the files
  rootFileNames.forEach(fileName => {
    // First time around, emit all files
    emitFile(fileName);

    // Add a watch on the file to handle next change
    fs.watchFile(fileName, { persistent: true, interval: 250 }, (curr, prev) => {
      // Check timestamp
      if (+curr.mtime <= +prev.mtime) {
        return;
      }

      // Update the version to signal a change in the file
      files[fileName].version++;

      // write the changes to disk
      emitFile(fileName);
    });
  });

  function emitFile(fileName) {
    let output = services.getEmitOutput(fileName);

    if (!output.emitSkipped) {
      console.log(`Emitting ${fileName}`);
    } else {
      console.log(`Emitting ${fileName} failed`);
      logErrors(fileName);
    }

    output.outputFiles.forEach(o => {
      fs.writeFileSync(path.resolve('../',options.compilerOptions.outDir, o.name), o.text, "utf8");
    });
  }

  function logErrors(fileName) {
    let allDiagnostics = services
      .getCompilerOptionsDiagnostics()
      .concat(services.getSyntacticDiagnostics(fileName))
      .concat(services.getSemanticDiagnostics(fileName));

    allDiagnostics.forEach(diagnostic => {
      let message = ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n");
      if (diagnostic.file) {
        let { line, character } = diagnostic.file.getLineAndCharacterOfPosition(
          diagnostic.start
        );
        console.log(
          `  Error ${diagnostic.file.fileName} (${line + 1},${character +
            1}): ${message}`
        );
      } else {
        console.log(`  Error: ${message}`);
      }
    });
  }
}

// Initialize files constituting the program as all .ts files in the current directory
const currentDirectoryFiles = fs
  .readdirSync(path.resolve(cwd))
  .filter(
    fileName =>
      fileName.length >= 3 && fileName.substr(fileName.length - 3, 3) === ".ts"
  );
console.log(currentDirectoryFiles)
console.log()
// console.log(fs.readdirSync(process.cwd()+'./src'))
// Start the watcher
const tsconfig =  function(){
  try {
    return require(path.resolve(cwd,'../tsconfig.json'))
  } catch(e) {
    return {};
  }
}()
// console.log(tsconfig)
watch(currentDirectoryFiles, tsconfig);