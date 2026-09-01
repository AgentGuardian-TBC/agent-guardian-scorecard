'use client';

import { useState } from 'react';
import './page.css';

const QUESTIONS = [
  ["Visibility", "I can tell, this week, how many dollars I spent on AI tokens - by project or tool, not just one giant invoice."],
  ["Visibility", "I know which model, agent, or chat is responsible for most of my spend."],
  ["Visibility", "I have a simple number I check (daily or weekly cap, remaining budget, or cost-per-task) instead of finding out when the card declines."],
  ["Caps", "Every key or workspace I use has a hard spend or token limit."],
  ["Caps", "If an agent or script starts looping, something stops it before it burns the month."],
  ["Caps", "I can kill or pause a runaway job in under two minutes without logging into five dashboards."],
  ["Routing", "I use a cheap/fast model by default and only escalate to a frontier model when the task actually needs it."],
  ["Routing", "I have a rule for what good enough means, so I don't re-run the same prompt on a more expensive model just to see."],
  ["Routing", "I cache or reuse answers for repeated tasks instead of paying full price every time."],
  ["Agent waste", "My agents have a max number of steps, tool calls, or retries before they must stop or ask me."],
  ["Agent waste", "I strip context (old chat, huge files, unused tools) before sending a job, instead of pasting the whole pile in."],
  ["Agent waste", "I batch similar work instead of starting a fresh expensive thread for every tiny question."],
  ["Habits", "I treat AI spend like a budget line, not like it's just tokens."],
  ["Habits", "Before I start a long agent run, I estimate what it should cost and what too much looks like."],
  ["Habits", "When a run costs more than expected, I look at why before I hit run again."]
];

const COPY = {
  Visibility: "You cannot manage a bill you cannot see. Right now spend lives in a provider invoice and a bad feeling. First fix: pick one number you will check every Monday - dollars this week, or remaining budget - and one place it lives. Screenshot it. If you cannot answer what did AI cost me last week? in ten seconds, nothing else in this scorecard will stick.",
  Caps: "You have access. You do not have brakes. A looping agent or a fat prompt should hit a wall, not your card. First fix: put a hard spend or token limit on every key and workspace you actually use. Then write down how you kill a runaway job in under two minutes. If that takes a treasure hunt, the leak is still open.",
  Routing: "You are paying steak prices for eggs. Frontier models are for hard work. Default cheap. Escalate on purpose. First fix: make a five-line list of task types that deserve the expensive model. Everything else goes to the cheap/fast default. Ban just to see reruns on a higher tier unless you write down why.",
  "Agent waste": "The silent multiplier. Extra steps, fat context, retries, and a new thread for every tiny question will beat a high sticker price every time. First fix: set max steps and max retries in writing. Strip the pile before you send it. Batch the small stuff. One sloppy agent loop can cost more than a month of careful chat.",
  Habits: "The human leak. Tokens feel free until they are not. First fix: before any run that might last more than ten minutes, estimate the cost and write too much. When a run overshoots, look at why before you hit run again. A controller helps. A pause before launch helps more."
};

const BANDS = {
  low: "Leak is open. You are flying blind and paying for it. Spend is happening without a number, a cap, or a kill switch. Do not optimize prompts yet. Put a weekly number on the wall and a hard limit on every key this week. Agent Guardian exists for this stage: stop the bleed, then get fancy.",
  mid_low: "You feel it. You do not control it. You know tokens cost money. You still find out after the fact. Routing and agent limits will save more than another be careful rule. Write a cheap-default model list and a max-steps cap before Friday.",
  mid_high: "Discipline without a system. You are leaving money on the table, not lighting it on fire. Cache repeats. Define good enough so you stop re-running the same job on a more expensive model. A controller turns your good habits into something that still works when you are tired.",
  high: "Ready for the controller, not a lecture. You already think like an operator. The next win is enforcement: budgets that hold when an agent loops at 2 a.m. Agent Guardian is the lock on a door you already closed most of the way."
};

export default function Scorecard() {
  const [stage, setStage] = useState('land');
  const [answers, setAnswers] = useState<(number | null)[]>(Array(15).fill(null));
  const [currentQ, setCurrentQ] = useState(0);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAnswer = (value: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQ] = value;
    setAnswers(newAnswers);
  };

  const handleNextQuestion = () => {
    if (answers[currentQ] === null) {
      alert('Pick 1 through 5. 1 = never / not true. 5 = always / very true.');
      return;
    }
    if (currentQ < 14) {
      setCurrentQ(currentQ + 1);
    } else {
      setStage('gate');
    }
  };

  const handleShowResults = async () => {
    if (!email.trim() || !email.includes('@')) {
      alert('Need a real email to unlock the score.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/scorecard-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          answers,
          ts: new Date().toISOString()
        })
      });

      if (!res.ok) throw new Error('Failed to save lead');
    } catch (err) {
      console.error('Lead capture error:', err);
    }

    setLoading(false);
    setStage('results');
  };

  const avg = (arr: number[]) => arr.reduce((a, b) => a + b, 0) / arr.length;
  const cats = {
    Visibility: answers.slice(0, 3) as number[],
    Caps: answers.slice(3, 6) as number[],
    Routing: answers.slice(6, 9) as number[],
    "Agent waste": answers.slice(9, 12) as number[],
    Habits: answers.slice(12, 15) as number[]
  };
  
  const scores: Record<string, number> = {};
  Object.keys(cats).forEach(k => {
    scores[k] = avg(cats[k]);
  });
  
  const overall = avg(answers as number[]);
  const order = ["Caps", "Agent waste", "Visibility", "Routing", "Habits"];
  let weakest = order[0];
  order.forEach(k => {
    if (scores[k] < scores[weakest]) weakest = k;
  });

  const getBand = (score: number) => {
    if (score <= 2.4) return BANDS.low;
    if (score <= 3.4) return BANDS.mid_low;
    if (score <= 4.4) return BANDS.mid_high;
    return BANDS.high;
  };

  return (
    <div className="container">
      <header>ts and occasional product updates for Agent Guardian. Unsubscribe anytime.</p>
          </section>
        )}

        {stage === 'results' && (
          <section>
            <p className="eyebrow">Token Waste Score</p>
            <div className="score">{overall.toFixed(1)} / 5</div>
            <p className="lead">Weakest spoke: {weakest}. That is the leak. Fix that first.</p>
            <p>{getBand(overall)}</p>
            <div className="card">
              {Object.keys(scores).map(k => (
                <div key={k} className={`cat ${k === weakest ? 'weak' : ''}`}>
                  <span>{k}</span>
                  <span>{scores[k].toFixed(1)}</span>
                </div>
              ))}
            </div>
            <div className="card">
              <h2>{weakest}</h2>
              <p>{COPY[weakest as keyof typeof COPY]}</p>
            </div>
            <h2>Want a lock on the leak, not another checklist?</h2>
            <p>Agent Guardian is the control layer for people who run agents on a real budget. Caps, visibility, and a stop when a job goes feral.</p>
            <a className="btn" href="https://agentguardian.dev" target="_blank" rel="noopener noreferrer">Join the Agent Guardian list</a>
          </section>
        )}
      </main>

      <footer>Agent Guardian · Token Waste Scorecard · Results are a snapshot, not financial advice.</footer>
    </div>
  );
  }
