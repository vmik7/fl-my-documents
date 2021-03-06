module.exports = {
    extends: [
        'stylelint-config-standard',
        'stylelint-config-rational-order',
        'stylelint-prettier/recommended',
    ],
    plugins: ['stylelint-order', 'stylelint-scss'],
    rules: {
        'block-no-empty': null,
        'at-rule-no-unknown': null,
        'scss/at-rule-no-unknown': true,
        'no-empty-source': null,
        'no-invalid-position-at-import-rule': null,
    },
};
