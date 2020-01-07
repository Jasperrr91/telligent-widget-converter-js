import fs from 'fs';
import {
  createThemeOptionsFile,
  createScript,
  createFileFromCData,
  createPreviewImage,
} from './functions';

jest.mock('fs');

describe('Theme Decodes correctly', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('Writes theme options as json to a file', () => {
    const sampleAttributes = {
      name: 'Social',
      version: '11.1.0.9731',
      description: "'Social' Blog Theme",
    };
    const sampleTheme = {
      attr: sampleAttributes,
    };

    const sampleDir = '/aXgkD';
    fs.mkdirSync(sampleDir);

    createThemeOptionsFile(sampleTheme, sampleDir);

    const mockFile = [sampleDir, '/theme_options.json'].join('');
    const theme = fs.readFileSync(mockFile, 'UTF8');
    const themeObject = JSON.parse(theme);
    expect(themeObject).toEqual(sampleAttributes);
  });

  test('Writes a script to a file with the correct extension', () => {
    const sampleName = 'headScript';

    const sampleScript = `$context_v2_themeHeader.RenderStylesheetFiles()
  $context_v2_themeHeader.RenderJavascriptFiles()`;

    const sampleScriptObject = {
      attr: { language: 'Velocity' },
      __cdata: sampleScript,
    };

    const sampleParentObject = {
      [sampleName]: sampleScriptObject,
    };

    const sampleDir = '/aXgkDd';
    fs.mkdirSync(sampleDir);
    const scriptsDir = [sampleDir, '/scripts'].join('');
    fs.mkdirSync(scriptsDir);

    createScript(sampleName, sampleParentObject, sampleDir);

    const mockFile = [sampleDir, '/scripts/', sampleName, '.vm'].join('');
    const scriptObject = fs.readFileSync(mockFile, 'UTF8');
    expect(scriptObject).toEqual(sampleScript);
  });

  test('Writes cdata of object to file', () => {
    const sampleName = 'sample.php';
    const cdata = "<?php echo('some random php code'); ?>";
    const sampleData = {
      __cdata: cdata,
    };
    const sampleDir = '/';
    createFileFromCData(sampleName, sampleData, sampleDir);

    const createdFile = fs.readFileSync('/sample.php', 'UTF8');
    expect(createdFile).toEqual(cdata);
  });

  test('Writes encoded preview image to file', () => {
    const encodedImage = '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';
    const object = {
      attr: {
        name: 'sample.png',
      },
      __cdata: encodedImage,
    };
    const sampleDir = '/';

    createPreviewImage(object, sampleDir);

    const createdImage = fs.readFileSync('/sample.png');
    const encodedCreatedImage = createdImage.toString('base64');
    expect(encodedCreatedImage).toEqual(encodedImage);
  });
});
