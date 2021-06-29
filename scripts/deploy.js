const util = require('util');
const execFile = util.promisify(require('child_process').execFile);
const { buildFolderName } = require('../gulp/routes');

(async () => {
    try {
        console.log('1. Stashing changes ...');
        await execFile('git', ['stash', 'save', '-u', '"stash before deploy"']);

        console.log('2. Building ...');
        await execFile('git', ['checkout', '--orphan', 'gh-pages']);
        await execFile('npm', ['run', 'build']);
        await execFile('git', ['--work-tree', buildFolderName, 'add', '--all']);
        await execFile('git', [
            '--work-tree',
            buildFolderName,
            'commit',
            '-m',
            'gh-pages',
        ]);

        console.log('3. Pushing to gh-pages ...');
        await execFile('git', ['push', 'origin', 'HEAD:gh-pages', '--force']);
        await execFile('rm', ['-r', buildFolderName]);
        await execFile('git', ['checkout', '-f', 'master']);
        await execFile('git', ['branch', '-D', 'gh-pages']);

        console.log('4. Applying stashed changes ...');
        await execFile('git', ['stash', 'apply']);

        console.log('Successfully deployed!');
    } catch (e) {
        console.error('Have some errors!');

        console.log(e.message);

        process.exit(1);
    }
})();
