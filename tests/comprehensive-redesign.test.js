import test from 'node:test';
import assert from 'node:assert/strict';
import {compile} from '../scripts/import-cell-structure.mjs';
import '../public/dashboard/cell-content.js';
import '../public/dashboard/cell-learning.js';
import '../public/dashboard/cell-state.js';
import '../public/dashboard/academic-figures.js';
import '../public/dashboard/cell-structure.js';
import '../public/dashboard/academic-contract.js';

const api = globalThis.DominanceCellStructure, data = compile();

function uiHarness(content = data) {
  const nodes = new Map(), cache = new Map();
  let focused = false, _confirmation, _recorded = false;
  class Node {
    constructor(tag) {
      this.tag = tag;
      this.children = [];
      this.attributes = {};
      this.className = '';
      this.dataset = {};
      this.classList = {
        contains: name => this.classes?.has(name) || this.className.includes(name),
        add: name => { this.classes ??= new Set(); this.classes.add(name); },
        remove: name => { this.classes ??= new Set(); this.classes.delete(name); },
        toggle: (name, on) => {
          this.classes ??= new Set();
          if (on === undefined) on = !this.classes.has(name);
          if (on) this.classes.add(name); else this.classes.delete(name);
        }
      };
    }
    click() { if (this.onclick) this.onclick({ preventDefault() {}, stopPropagation() {} }); }
    set id(id) { this.identifier = id; nodes.set(id, this); }
    get id() { return this.identifier; }
    set innerHTML(value) { this.html = value; this.children = []; }
    get innerHTML() { return this.html || ''; }
    append(...children) { this.children.push(...children); }
    before(node) { nodes.set(node.id, node); }
    setAttribute(k, v) { this.attributes[k] = v; }
    getAttribute(k) { return this.attributes[k] ?? null; }
    querySelector(selector) {
      const walk = n => [n, ...(n.children || []).flatMap(walk)];
      if (selector === 'h2') return walk(this).find(n => n.tag === 'h2') || { setAttribute(){}, focus(){} };
      if (selector === '.flag-btn') return walk(this).find(n => n.className?.includes('flag-btn'));
      if (selector === '.check-answer-btn') return walk(this).find(n => n.className?.includes('check-answer-btn'));
      if (selector.startsWith('select[')) {
        const match = selector.match(/aria-label="([^"]+)"/);
        return walk(this).find(n => n.tag === 'select' && n.attributes?.['aria-label'] === match?.[1]);
      }
      return null;
    }
    querySelectorAll(selector) {
      const walk = n => [n, ...(n.children || []).flatMap(walk)];
      if (selector === '.answer') return walk(this).filter(n => n.className?.includes('answer'));
      if (selector === 'button') return walk(this).filter(n => n.tag === 'button');
      return walk(this).filter(n => n.tag === selector || n.className?.includes(selector.replace('.', '')));
    }
  }
  const document = {
    createElement: tag => new Node(tag),
    getElementById: id => {
      if (!nodes.has(id)) {
        const n = new Node('div');
        n.id = id;
      }
      return nodes.get(id);
    }
  };
  const storage = {
    getItem: key => cache.get(key) ?? null,
    getConfirmedItem: key => cache.get(key) ?? null,
    setItem: (key, value) => { cache.set(key, value); return true; }
  };
  const keyListeners = [];
  const windowObj = {
    scrollY: 0,
    requestAnimationFrame: fn => fn(),
    scrollTo: () => {},
    clearTimeout: () => {},
    setTimeout: () => {},
    addEventListener: (type, fn) => { if (type === 'keydown') keyListeners.push(fn); }
  };
  const ctx = {
    owner: 'student-tester',
    data: content,
    document,
    storage,
    window: windowObj,
    context: () => ({ scopes: ['HB1:First'], scope: 'HB1:First', course: 'Cell Structure' }),
    toast() {},
    newId: () => 'attempt-' + Math.random().toString(36).slice(2),
    openTopic() {},
    openCellCourse() {},
    showPractice() {},
    focus: on => { focused = on; },
    recorded: on => { _recorded = on; },
    confirm: value => { _confirmation = value; }
  };
  const pilot = api.create(ctx);
  const buttons = id => {
    const walk = n => [n, ...(n.children || []).flatMap(walk)];
    return walk(document.getElementById(id)).filter(n => n.tag === 'button');
  };
  const fireKey = (key, extra = {}) => {
    for (const fn of keyListeners) fn({ key, preventDefault() {}, target: { tagName: 'body' }, ...extra });
  };
  return { ctx, pilot, cache, buttons, node: id => document.getElementById(id), read: () => api.state(cache.get('cellStructure'), data), fireKey, get focused() { return focused; } };
}

test('Quiz Setup offers Submit at End and Mark as You Go modes, adapting to available questions', () => {
  const h = uiHarness();
  h.pilot.practice(true);
  h.buttons('cellPractice').find(b => b.textContent === 'Open Topic Questions').onclick();
  const walk = n => [n, ...(n.children || []).flatMap(walk)];
  const modeSelect = walk(h.node('cellPractice')).find(n => n.getAttribute?.('aria-label') === 'Marking mode');
  assert.ok(modeSelect);
  assert.equal(modeSelect.children.length, 3);
  assert.equal(modeSelect.children[0].value, 'submit_at_end');
  assert.equal(modeSelect.children[1].value, 'check_answer');
  assert.equal(modeSelect.children[2].value, 'instant');
});

test('Mark as you go (Check Answer) workflow locks option, reveals correctness and Level 1 explanation', () => {
  const h = uiHarness();
  h.pilot.practice(true);
  h.buttons('cellPractice').find(b => b.textContent === 'Open Topic Questions').onclick();
  const walk = n => [n, ...(n.children || []).flatMap(walk)];
  const modeSelect = walk(h.node('cellPractice')).find(n => n.getAttribute?.('aria-label') === 'Marking mode');
  modeSelect.value = 'check_answer';
  const countSelect = walk(h.node('cellPractice')).find(n => n.getAttribute?.('aria-label') === 'Question count');
  countSelect.value = '5';
  h.buttons('cellPractice').find(b => b.textContent === 'Start practice').onclick();

  const draft = h.read().draft;
  assert.equal(draft.mode, 'check_answer');
  assert.equal(draft.questions.length, 5);

  let checkBtn = h.buttons('quizArea').find(b => b.textContent === 'Check Answer');
  assert.ok(checkBtn);
  assert.equal(checkBtn.disabled, true);

  // Select first option
  const options = h.buttons('quizArea').filter(b => b.className.includes('answer'));
  options[0].onclick();
  checkBtn = h.buttons('quizArea').find(b => b.textContent === 'Check Answer');
  assert.equal(checkBtn.disabled, false);

  // Click Check Answer
  checkBtn.onclick();
  const updatedDraft = h.read().draft;
  assert.equal(updatedDraft.checked[updatedDraft.questions[0]], true);

  // Verified: options are locked and explanation is rendered
  const answersAfter = h.buttons('quizArea').filter(b => b.className.includes('answer'));
  assert.ok(answersAfter.some(b => b.className.includes('correct') || b.className.includes('incorrect')));
  assert.equal(answersAfter[0].disabled, true);

  const fb = walk(h.node('quizArea')).find(n => n.className?.includes('cell-explanation-box'));
  assert.ok(fb);
  assert.match(walk(fb).map(n => n.textContent || '').join(' '), /Correct|Incorrect/);
});

test('Flag for Review toggles flag status and displays in question navigator and review list', () => {
  const h = uiHarness();
  h.pilot.lesson('lesson:CO01:0');
  h.buttons('studyOutput').find(b => b.textContent === 'Practise this lesson').onclick();

  let flagBtn = h.buttons('quizArea').find(b => b.className.includes('flag-btn'));
  assert.ok(flagBtn);
  assert.equal(flagBtn.textContent, '⚐ Flag for review');

  // Toggle flag
  flagBtn.onclick();
  assert.ok(h.read().draft.flags.includes(h.read().draft.questions[0]));
  flagBtn = h.buttons('quizArea').find(b => b.className.includes('flag-btn'));
  assert.equal(flagBtn.textContent, '⚑ Flagged');

  // Question review screen reflects flag
  h.buttons('quizArea').find(b => b.textContent === 'Review responses').onclick();
  const qBtn = h.buttons('quizArea').find(b => b.textContent.startsWith('Question 1'));
  assert.match(qBtn.textContent, /⚑/);
});

test('Results screen supports Review Wrong Answers filter and Retry Wrong Questions', () => {
  const h = uiHarness();
  h.pilot.lesson('lesson:CO01:0');
  h.buttons('studyOutput').find(b => b.textContent === 'Practise this lesson').onclick();

  // Answer first question wrong, second question right
  const walk = n => [n, ...(n.children || []).flatMap(walk)];
  const draft = h.read().draft;
  const q0 = data.questions.find(q => q.id === draft.questions[0]);
  const correctOpt = q0.letter.charCodeAt(0) - 65;
  const wrongOpt = (correctOpt + 1) % 4;

  const answers0 = h.buttons('quizArea').filter(b => b.className.includes('answer'));
  const wrongBtn = answers0.find(b => Number(b.dataset.option) === wrongOpt);
  wrongBtn.onclick();

  h.buttons('quizArea').find(b => b.textContent === 'Next question').onclick();
  const q1 = data.questions.find(q => q.id === draft.questions[1]);
  const answers1 = h.buttons('quizArea').filter(b => b.className.includes('answer'));
  const rightBtn = answers1.find(b => Number(b.dataset.option) === (q1.letter.charCodeAt(0) - 65));
  rightBtn.onclick();

  h.buttons('quizArea').find(b => b.textContent === 'Review responses').onclick();
  h.buttons('quizArea').find(b => b.textContent.startsWith('Submit practice')).onclick();

  // Results screen has Review Wrong Answers and Retry Wrong Questions
  const reviewWrongBtn = h.buttons('quizArea').find(b => b.textContent.startsWith('Review Wrong Answers'));
  assert.ok(reviewWrongBtn);

  const retryWrongBtn = h.buttons('quizArea').find(b => b.textContent.startsWith('Retry Wrong Questions'));
  assert.ok(retryWrongBtn);

  // Click Review Wrong Answers: details for correct question are hidden
  reviewWrongBtn.onclick();
  const details = h.node('quizArea').children.filter(n => n.tag === 'details');
  assert.equal(details[0].hidden, false); // question 1 was wrong
  assert.equal(details[1].hidden, true);  // question 2 was right

  // Click Retry Wrong Questions: launches new attempt with ONLY missed questions
  retryWrongBtn.onclick();
  const newDraft = h.read().draft;
  assert.ok(newDraft);
  assert.equal(newDraft.questions.length, draft.questions.length - 1); // only 1 question was right, remaining 5 are in retry
  assert.ok(newDraft.questions.includes(q0.id));
  assert.ok(!newDraft.questions.includes(q1.id));
});

test('Desktop keyboard shortcuts support 1-4 option picking, navigation, flag, and check answer', () => {
  const h = uiHarness();
  h.pilot.practice(true);
  h.buttons('cellPractice').find(b => b.textContent === 'Open Topic Questions').onclick();
  const walk = n => [n, ...(n.children || []).flatMap(walk)];
  const modeSelect = walk(h.node('cellPractice')).find(n => n.getAttribute?.('aria-label') === 'Marking mode');
  modeSelect.value = 'check_answer';
  h.buttons('cellPractice').find(b => b.textContent === 'Start practice').onclick();

  // Press '2' key to select option 2 (original index 1 or corresponding)
  h.fireKey('2');
  const draft = h.read().draft;
  assert.notEqual(draft.responses[draft.questions[0]], undefined);

  // Press 'f' key to toggle flag
  h.fireKey('f');
  assert.ok(h.read().draft.flags.includes(h.read().draft.questions[0]));

  // Press 'Enter' to Check Answer
  h.fireKey('Enter');
  assert.equal(h.read().draft.checked[h.read().draft.questions[0]], true);

  // Press 'ArrowRight' to move to next question
  h.fireKey('ArrowRight');
  assert.equal(h.read().draft.index, 1);
});
