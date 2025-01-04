import Translator from '../components/translator.js';

export default function (app) {
  const translator = new Translator();

  app.route('/api/translate')
    .post((req, res) => {
      const { text, locale } = req.body;

      if (text === undefined || locale === undefined ) {
        return res.json({ error: 'Required field(s) missing' });
      }

      if (text === '') {
        return res.json({ error: 'No text to translate' });
      }

      const result = translator.translate(text, locale);

      if (result.error) {
        return res.json(result);
      }
      return res.json({
        text: req.body.text,
        translation: result.translation,
      });
    });
};
