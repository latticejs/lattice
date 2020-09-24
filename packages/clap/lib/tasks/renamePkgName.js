import assert from 'assert';
import { readFileSync, writeFileSync } from 'fs';

export default function renamePkgName(pkgName) {
  assert.ok(pkgName);
  assert.equal(typeof pkgName, 'string', 'clap: renamePkgName expects a string');

  try {
    const file = `./${pkgName}/package.json`;
    const pkg = JSON.parse(readFileSync(file, 'utf8'));
    pkg.name = pkgName;
    writeFileSync(file, JSON.stringify(pkg, null, 2));
    return Promise.resolve({ code: 0 });
  } catch (err) {
    return Promise.reject({ code: 1, stderr: err });
  }
}
