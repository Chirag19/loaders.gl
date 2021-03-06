import test from 'tape-promise/tape';
import parseShape from '@loaders.gl/shapefile/lib/parse-shp';
import {fetchFile} from '@loaders.gl/core';
import {geojsonToBinary} from '@loaders.gl/gis';

const SHAPEFILE_JS_DATA_FOLDER = '@loaders.gl/shapefile/test/data/shapefile-js';
const SHAPEFILE_JS_POINT_TEST_FILES = ['points', 'multipoints'];
const SHAPEFILE_JS_POLYLINE_TEST_FILES = ['polylines'];
const SHAPEFILE_JS_POLYGON_TEST_FILES = ['polygons'];

test('Shapefile JS Point tests', async t => {
  for (const testFileName of SHAPEFILE_JS_POINT_TEST_FILES) {
    let response = await fetchFile(`${SHAPEFILE_JS_DATA_FOLDER}/${testFileName}.shp`);
    const body = await response.arrayBuffer();

    response = await fetchFile(`${SHAPEFILE_JS_DATA_FOLDER}/${testFileName}.json`);
    const json = await response.json();
    const output = parseShape(body);

    for (let i = 0; i < json.features.length; i++) {
      const expBinary = geojsonToBinary([json.features[i]]).points.positions;
      t.deepEqual(output.features[i].positions, expBinary);
    }
  }

  t.end();
});

test('Shapefile JS Polyline tests', async t => {
  for (const testFileName of SHAPEFILE_JS_POLYLINE_TEST_FILES) {
    let response = await fetchFile(`${SHAPEFILE_JS_DATA_FOLDER}/${testFileName}.shp`);
    const body = await response.arrayBuffer();

    response = await fetchFile(`${SHAPEFILE_JS_DATA_FOLDER}/${testFileName}.json`);
    const json = await response.json();
    const output = parseShape(body);

    for (let i = 0; i < json.features.length; i++) {
      const expBinary = geojsonToBinary([json.features[i]]).lines;
      t.deepEqual(output.features[i].positions, expBinary.positions);
      t.deepEqual(output.features[i].indices, expBinary.pathIndices);
    }
  }

  t.end();
});

test('Shapefile JS Polygon tests', async t => {
  for (const testFileName of SHAPEFILE_JS_POLYGON_TEST_FILES) {
    let response = await fetchFile(`${SHAPEFILE_JS_DATA_FOLDER}/${testFileName}.shp`);
    const body = await response.arrayBuffer();

    response = await fetchFile(`${SHAPEFILE_JS_DATA_FOLDER}/${testFileName}.json`);
    const json = await response.json();
    const output = parseShape(body);

    for (let i = 0; i < json.features.length; i++) {
      const expBinary = geojsonToBinary([json.features[i]]).polygons;
      t.deepEqual(output.features[i].positions, expBinary.positions);
      t.deepEqual(output.features[i].indices, expBinary.primitivePolygonIndices);
    }
  }

  t.end();
});
