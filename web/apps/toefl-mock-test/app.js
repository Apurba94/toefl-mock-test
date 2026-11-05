/* TOEFL Mock Test: a practice test across all four skills with the new task types. */
(function () {
  'use strict';
  const reading = (data, seed) => {
    const r = SK.rng(seed);
    const ctw = SK.sample(r, data.toefl_passages, 1).map((p) => { const c = SK.cTest(p.text, 10); return { id: 'm-ctw-' + p.id, type: 'gaps', topic: 'Complete the Words', stem: 'Fill in the missing letters.', parts: c.parts, answer: c.answer }; });
    const daily = SK.takeGroups(r, data.daily_texts.flatMap((t) => t.questions.map((q) => Object.assign({ stem: '' }, q, { passage: t.text, passageTitle: t.kind + ': ' + t.title, group: t.id, topic: 'Read in Daily Life' }))), 4);
    const acad = SK.takeGroups(r, SK.passageItems(data.toefl_passages).map((x) => Object.assign(x, { topic: 'Academic passage' })), 3);
    return ctw.concat(daily, acad);
  };
  const listening = (data, seed) => {
    const r = SK.rng(seed);
    const resp = SK.sample(r, data.responses, 6).map((x) => SK.shuffleItem(r, { id: 'm-cr-' + x.id, type: 'single', topic: 'Choose a Response', stem: 'Choose the best response.', audio: { title: 'Speaker', text: x.say }, audioOpts: { maxPlays: 1 }, choices: x.choices, answer: x.answer }));
    const pick = (kind) => SK.listeningItems(SK.sample(r, data.listening.filter((x) => x.kind === kind), 1)).map((it) => Object.assign(it, { audioOpts: { maxPlays: 1 }, topic: kind[0].toUpperCase() + kind.slice(1) }));
    return resp.concat(pick('conversation'), pick('announcement'), pick('talk'));
  };
  const building = (data, seed) => SK.sample(SK.rng(seed), data.build_sentences, 5).map((x) => SK.shuffleItem(SK.rng(seed + x.id.length), { id: 'm-bs-' + x.id, type: 'order', topic: 'Build a Sentence', stem: 'Put the words in order.', frame: x.context, answer: x.s.split(' ') }));
  const App = {
    about: 'A practice TOEFL across all four skills with the January 2026 task types: Complete the Words, Read in Daily Life and an academic passage; Choose a Response, a conversation, an announcement and a talk; Build a Sentence, an email and an academic discussion post; Listen and Repeat and an interview. Reading and listening are marked; writing and speaking you review yourself. Practice timings are defaults, not official ones.',
    how: ['Work through the tabs in order: **Reading**, **Listening**, **Writing**, **Speaking**.', 'In Listening, each recording plays once, as on the test.', 'Review your writing with the checklists and listen to your speaking recordings.', 'Raw scores only: this app does not convert to the 1 to 6 bands.'],
    tabs: [
      { id: 'reading', label: 'Reading', render(el, ctx) { el.appendChild(SK.card('Reading', SK.h('p', { class: 'sk-muted', text: 'Complete the Words, two daily-life texts and one academic passage. Practice time: 25 minutes.' }), SK.btn('Start reading', () => SK.quiz(el, reading(ctx.data, SK.seedNow()), { title: 'Mock test: Reading', mode: 'test', seconds: 25 * 60 }), '', { 'data-auto': 'once' }))); } },
      { id: 'listening', label: 'Listening', render(el, ctx) { el.appendChild(SK.card('Listening', SK.h('p', { class: 'sk-muted', text: 'Six short responses, a conversation, an announcement and a talk. Each plays once. Practice time: 20 minutes.' }), SK.btn('Start listening', () => SK.quiz(el, listening(ctx.data, SK.seedNow()), { title: 'Mock test: Listening', mode: 'test', seconds: 20 * 60 }), '', { 'data-auto': 'once' }))); } },
      { id: 'writing', label: 'Writing', render(el, ctx) {
        const host = SK.h('div', {});
        el.appendChild(SK.card('Writing: part 1', SK.btn('Start Build a Sentence', () => SK.quiz(host, building(ctx.data, SK.seedNow()), { title: 'Build a Sentence', mode: 'test', seconds: 5 * 60 }), '', { 'data-auto': 'once' }), host));
        const em = SK.pick(SK.rng(SK.daySeed('toefl-mock-email')), ctx.data.email_tasks), dd = SK.pick(SK.rng(SK.daySeed('toefl-mock-disc')), ctx.data.discussions);
        const a = SK.h('div', {}), b = SK.h('div', {});
        el.append(a, b);
        SK.writer(a, { key: 'mock-email', title: 'Writing: email', prompt: 'To: ' + em.to + '\n' + em.situation + '\n' + em.points.map((p) => '• ' + p).join('\n'), minutes: 7, target: [80, 150] });
        SK.writer(b, { key: 'mock-disc', title: 'Writing: academic discussion', prompt: dd.professor + '\n\n' + dd.posts.map(([n, t]) => n + ': ' + t).join('\n\n'), minutes: 10, target: [100, 180] });
      } },
      { id: 'speaking', label: 'Speaking', render(el, ctx) {
        const r = SK.rng(SK.daySeed('toefl-mock-speak'));
        const sents = SK.sample(r, ctx.data.dictation.filter((d) => d.level >= 2), 4);
        el.appendChild(SK.card('Speaking: Listen and Repeat', sents.map((d, i) => SK.h('div', { style: { borderTop: '1px solid var(--line)', padding: '8px 0' } }, SK.audioPlayer({ title: 'Sentence ' + (i + 1), text: d.text }, { maxPlays: 1 }), SK.recorder({ seconds: 12 })))));
        const set = SK.pick(r, ctx.data.interview.sets);
        el.appendChild(SK.card('Speaking: interview on ' + set.topic.toLowerCase(), set.questions.map((q, i) => SK.h('div', { style: { borderTop: '1px solid var(--line)', padding: '8px 0' } }, SK.audioPlayer({ title: 'Question ' + (i + 1), text: q }, { maxPlays: 1 }), SK.recorder({ seconds: 45 })))));
      } },
    ],
    reading, listening, building,
    checks: { 'each marked section is complete and valid': (data, assert) => {
      for (let s = 1; s < 10; s++) {
        const R = reading(data, s), L = listening(data, s), B = building(data, s);
        assert.ok(R.some((x) => x.type === 'gaps') && R.length >= 6);
        assert.equal(L.filter((x) => x.topic === 'Choose a Response').length, 6);
        assert.equal(B.length, 5);
        for (const it of R.concat(L, B)) assert.deepEqual(SK.validateItem(it), []);
      }
    } },
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = App; else SK.start(App);
})();
