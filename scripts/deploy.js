const util = require('util');
const execFile = util.promisify(require('child_process').execFile);
const { buildFolderName } = require('../gulp/routes');

(async () => {
    try {
        await execFile('git', ['checkout', '--orphan', 'gh-pages']);
        console.log('Building...');
        await execFile('npm', ['run', 'build']);
        await execFile('git', ['--work-tree', buildFolderName, 'add', '--all']);
        await execFile('git', [
            '--work-tree',
            buildFolderName,
            'commit',
            '-m',
            'gh-pages',
        ]);
        console.log('Pushing to gh-pages...');
        await execFile('git', ['push', 'origin', 'HEAD:gh-pages', '--force']);
        await execFile('rm', ['-r', buildFolderName]);
        await execFile('git', ['checkout', '-f', 'master']);
        await execFile('git', ['branch', '-D', 'gh-pages']);
        console.log('Successfully deployed!');
    } catch (e) {
        console.log(e.message);
        process.exit(1);
    }
})();
