'use client';

import {
  Archive,
  ArrowUpRight,
  Calendar,
  CalendarPlus,
  Check,
  ChevronRight,
  Clock,
  CornerUpLeft,
  Inbox,
  LayoutDashboard,
  ListChecks,
  LogOut,
  Mail,
  Receipt,
  Search,
  Sparkles,
  StickyNote,
  Wallet,
  type LucideIcon,
} from 'lucide-react';
import { useState, type ComponentType } from 'react';
import { useAuth } from '@/lib/auth-context';
import TasksScreen from '@/components/TasksScreen';
import NotesScreen from '@/components/NotesScreen';
import FinancesScreen from '@/components/FinancesScreen';

type Tab = 'dashboard' | 'inbox' | 'tasks' | 'money' | 'calendar' | 'notes';

type DemoTask = {
  id: number;
  title: string;
  meta: string;
  done: boolean;
  cat: string;
};

const navItems: { id: Tab; label: string; icon: LucideIcon }[] = [
  { id: 'dashboard', label: 'Today', icon: LayoutDashboard },
  { id: 'inbox', label: 'Inbox', icon: Inbox },
  { id: 'tasks', label: 'Tasks', icon: ListChecks },
  { id: 'money', label: 'Money', icon: Wallet },
  { id: 'calendar', label: 'Calendar', icon: Calendar },
  { id: 'notes', label: 'Notes', icon: StickyNote },
];

const tabTitles: Record<Tab, string> = {
  dashboard: 'Today',
  inbox: 'Inbox',
  tasks: 'Tasks',
  money: 'Money',
  calendar: 'Calendar',
  notes: 'Notes',
};

const initialTasks: DemoTask[] = [
  { id: 1, title: 'Send Wolf Flow proposal', meta: 'Today · high', done: false, cat: 'Wolf Flow' },
  { id: 2, title: 'Greyson + Porter early-release pickup', meta: 'Thu 1:15 · Athens', done: false, cat: 'Family' },
  { id: 3, title: 'Renew wolfflow.ai domain', meta: 'Fri', done: false, cat: 'Admin' },
  { id: 4, title: 'Grocery run', meta: 'Weekend', done: true, cat: 'Home' },
];

export default function LifeOSShell() {
  const { user, signOut } = useAuth();
  const [tab, setTab] = useState<Tab>('dashboard');
  const [tasks, setTasks] = useState<DemoTask[]>(initialTasks);

  const toggle = (id: number) =>
    setTasks((current) =>
      current.map((task) => (task.id === id ? { ...task, done: !task.done } : task)),
    );

  const firstName = (user?.displayName ?? user?.email ?? 'there').split(' ')[0].split('@')[0];
  const initials = (user?.displayName ?? user?.email ?? '?')
    .split(' ')
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div className="lo-root">
      <style>{css}</style>
      <div className="lo-aurora" aria-hidden="true">
        <span className="b b1" />
        <span className="b b2" />
        <span className="b b3" />
      </div>

      <aside className="lo-side">
        <div className="lo-brand">
          <span className="lo-mark">✦</span>
          <span className="lo-brandtxt">Life OS</span>
        </div>
        <nav className="lo-nav">
          {navItems.map((item) => (
            <button
              key={item.id}
              className={'lo-navitem' + (tab === item.id ? ' on' : '')}
              onClick={() => setTab(item.id)}
              type="button"
            >
              <item.icon size={18} strokeWidth={2} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="lo-side-foot">
          <div className="lo-avatar">{initials || '·'}</div>
          <div className="lo-side-foot-txt">
            <div className="nm">{user?.displayName ?? user?.email ?? 'Signed in'}</div>
            <div className="sub">Personal</div>
          </div>
          <button
            className="lo-signout"
            onClick={() => signOut()}
            type="button"
            aria-label="Sign out"
            title="Sign out"
          >
            <LogOut size={15} />
          </button>
        </div>
      </aside>

      <main className="lo-main">
        <header className="lo-top">
          <div>
            <div className="lo-eyebrow">{tab === 'dashboard' ? 'Today' : tabTitles[tab]}</div>
            <h1 className="lo-h1">
              {tab === 'dashboard' ? `Good evening, ${firstName}` : tabTitles[tab]}
            </h1>
          </div>
          <div className="lo-ask">
            <Search size={16} />
            <input placeholder="Ask anything, or capture a thought…" />
            <span className="lo-ask-k">⏎</span>
          </div>
        </header>

        <div className="lo-scroll">
          {tab === 'dashboard' && <Dashboard tasks={tasks} toggle={toggle} />}
          {tab === 'inbox' && <InboxView />}
          {tab === 'tasks' && <TasksScreen />}
          {tab === 'money' && <FinancesScreen />}
          {tab === 'notes' && <NotesScreen />}
          {tab === 'calendar' && <Soon name={tabTitles[tab]} />}
          {/* Tasks, Notes and Money are real now; the demo notice only applies to the rest. */}
          {tab !== 'tasks' && tab !== 'notes' && tab !== 'money' && (
            <div className="lo-demo">Demo data — not yet connected to your accounts</div>
          )}
        </div>
      </main>

      <nav className="lo-tabbar">
        {navItems.slice(0, 5).map((item) => (
          <button
            key={item.id}
            className={'lo-tab' + (tab === item.id ? ' on' : '')}
            onClick={() => setTab(item.id)}
            type="button"
            aria-label={item.label}
          >
            <item.icon size={20} />
          </button>
        ))}
      </nav>
    </div>
  );
}

type CardProps = {
  children: React.ReactNode;
  className?: string;
  title?: string;
  action?: React.ReactNode;
};

function Card({ children, className = '', title, action }: CardProps) {
  return (
    <section className={'lo-card ' + className}>
      {title && (
        <div className="lo-card-head">
          <h2>{title}</h2>
          {action && <span className="lo-card-act">{action}</span>}
        </div>
      )}
      {children}
    </section>
  );
}

type DashboardProps = { tasks: DemoTask[]; toggle: (id: number) => void };

function Dashboard({ tasks, toggle }: DashboardProps) {
  const routed: { icon: ComponentType<{ size?: number }>; txt: string; tone: string }[] = [
    { icon: CalendarPlus, txt: '2 events added to your calendar', tone: 'teal' },
    { icon: Receipt, txt: '1 bill logged · reminder set for the 25th', tone: 'amber' },
    { icon: CornerUpLeft, txt: '1 reply drafted, waiting for your okay', tone: 'violet' },
    { icon: Archive, txt: '20 newsletters & promos archived as noise', tone: 'dim' },
  ];
  return (
    <div className="lo-grid">
      <Card className="span2 brief">
        <div className="brief-head">
          <Sparkles size={18} />
          <span>While you were away</span>
        </div>
        <p className="brief-lead">
          I read 23 new messages across Gmail and Outlook overnight. Here&apos;s what mattered.
        </p>
        <ul className="brief-list">
          {routed.map((r, i) => (
            <li key={i} className={'tone-' + r.tone}>
              <r.icon size={16} /> <span>{r.txt}</span>
            </li>
          ))}
        </ul>
        <button className="brief-cta" type="button">
          Review the morning queue <ChevronRight size={15} />
        </button>
      </Card>

      <Card title="Today" action={<ArrowUpRight size={15} />}>
        <ul className="lo-timeline">
          <li>
            <span className="t">9:00</span>
            <span className="d">Wolf Flow discovery call</span>
          </li>
          <li>
            <span className="t">1:15</span>
            <span className="d">Athens early release — pick up the boys</span>
          </li>
          <li>
            <span className="t">6:30</span>
            <span className="d">Dinner / no plans (good)</span>
          </li>
        </ul>
      </Card>

      <Card title="Tasks" action={<ArrowUpRight size={15} />}>
        <ul className="lo-tasks">
          {tasks.slice(0, 3).map((task) => (
            <li key={task.id}>
              <button
                className={'chk' + (task.done ? ' on' : '')}
                onClick={() => toggle(task.id)}
                type="button"
                aria-label={task.done ? 'Mark incomplete' : 'Mark complete'}
              >
                {task.done && <Check size={13} strokeWidth={3} />}
              </button>
              <div className={'tk' + (task.done ? ' done' : '')}>
                <div className="tt">{task.title}</div>
                <div className="tm">{task.meta}</div>
              </div>
            </li>
          ))}
        </ul>
      </Card>

      <Card title="Money" action={<ArrowUpRight size={15} />}>
        <div className="lo-money-glance">
          <div className="mg">
            <div className="mgl">Checking</div>
            <div className="mgv">$4,250</div>
          </div>
          <div className="mg">
            <div className="mgl">Savings</div>
            <div className="mgv">$12,840</div>
          </div>
        </div>
        <div className="lo-bill">
          <Clock size={14} /> Internet — $79.99 due Fri
        </div>
      </Card>

      <Card title="Needs your okay" className="approve">
        <div className="appr">
          <CornerUpLeft size={15} />
          <div>
            <div className="appr-t">Reply to a Wolf Flow inquiry</div>
            <div className="appr-s">Drafted and ready — read before it sends.</div>
          </div>
        </div>
        <div className="appr-row">
          <button className="btn ghost" type="button">
            Open draft
          </button>
          <button className="btn solid" type="button">
            Send
          </button>
        </div>
      </Card>
    </div>
  );
}

function InboxView() {
  const items: {
    from: string;
    subj: string;
    tag: 'Event' | 'Reply' | 'Bill' | 'Noise';
    src: string;
    unread: boolean;
  }[] = [
    { from: 'Athens Area Schools', subj: 'Early release Thursday — 1:15 dismissal', tag: 'Event', src: 'Outlook', unread: true },
    { from: 'Prospective client', subj: 'Re: AI workflow help for our team', tag: 'Reply', src: 'Gmail', unread: true },
    { from: 'AT&T', subj: 'Your bill is ready — $79.99', tag: 'Bill', src: 'Gmail', unread: true },
    { from: 'Adobe Creative Cloud', subj: 'New Lightroom features', tag: 'Noise', src: 'Gmail', unread: false },
    { from: 'Spotify', subj: 'Your Wrapped is here', tag: 'Noise', src: 'Gmail', unread: false },
  ];
  const tone: Record<string, string> = { Event: 'teal', Reply: 'violet', Bill: 'amber', Noise: 'dim' };
  return (
    <Card title="One inbox — Gmail + Outlook">
      <ul className="lo-mail">
        {items.map((m, i) => (
          <li key={i} className={m.unread ? 'unread' : ''}>
            {m.unread && <span className="dot" />}
            <Mail size={16} className="mi" />
            <div className="mc">
              <div className="mtop">
                <span className="mf">{m.from}</span>
                <span className={'chip tone-' + tone[m.tag]}>{m.tag}</span>
              </div>
              <div className="ms">{m.subj}</div>
            </div>
            <span className="msrc">{m.src}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}

function Soon({ name }: { name: string }) {
  return (
    <Card className="span2 soon">
      <Sparkles size={20} />
      <h2>{name} comes online later</h2>
      <p>This view gets wired in once the foundation and inbox are in place. The glass is already poured.</p>
    </Card>
  );
}

const css = `
.lo-root{
  --bg:#0A0D13; --text:#F4F2EC; --dim:rgba(244,242,236,.55); --faint:rgba(244,242,236,.32);
  --glass:rgba(255,255,255,.055); --glass2:rgba(255,255,255,.09); --line:rgba(255,255,255,.12);
  --amber:#F0B45F; --amber2:#E0934A; --teal:#6FC9A8; --violet:#AD93E6;
  position:relative; display:flex; min-height:100vh; width:100%;
  background:var(--bg); color:var(--text); overflow:hidden;
  font-family:-apple-system,"SF Pro Display","SF Pro Text",system-ui,"Segoe UI",sans-serif;
  -webkit-font-smoothing:antialiased;
}
.lo-root *{box-sizing:border-box;}
.lo-aurora{position:fixed; inset:0; z-index:0; pointer-events:none; filter:blur(70px);}
.lo-aurora .b{position:absolute; border-radius:50%; opacity:.5;}
.b1{width:46vw;height:46vw;left:-8vw;top:-12vw;background:radial-gradient(circle,#E0934A 0%,transparent 70%);animation:drift1 22s ease-in-out infinite;}
.b2{width:40vw;height:40vw;right:-6vw;bottom:-10vw;background:radial-gradient(circle,#3F8F76 0%,transparent 70%);animation:drift2 26s ease-in-out infinite;}
.b3{width:34vw;height:34vw;left:36vw;top:30vh;background:radial-gradient(circle,#6A4F9E 0%,transparent 70%);opacity:.32;animation:drift1 30s ease-in-out infinite reverse;}
@keyframes drift1{50%{transform:translate(6%,8%) scale(1.08);}}
@keyframes drift2{50%{transform:translate(-7%,-6%) scale(1.1);}}

.lo-side,.lo-card,.lo-ask,.lo-tabbar,.lo-avatar{
  background:var(--glass); backdrop-filter:blur(26px) saturate(150%); -webkit-backdrop-filter:blur(26px) saturate(150%);
  border:1px solid var(--line);
  box-shadow:inset 0 1px 0 rgba(255,255,255,.10), 0 18px 40px -20px rgba(0,0,0,.6);
}

.lo-side{position:relative; z-index:2; width:228px; flex:0 0 228px; margin:14px 0 14px 14px;
  border-radius:24px; padding:20px 14px; display:flex; flex-direction:column;}
.lo-brand{display:flex; align-items:center; gap:10px; padding:4px 8px 18px;}
.lo-mark{width:30px;height:30px;border-radius:9px;display:grid;place-items:center;font-size:11px;font-weight:700;color:#1a130a;
  background:linear-gradient(140deg,var(--amber),var(--amber2)); box-shadow:0 0 18px rgba(240,180,95,.4); letter-spacing:-1px;}
.lo-brandtxt{font-weight:600; letter-spacing:.2px;}
.lo-nav{display:flex; flex-direction:column; gap:3px; flex:1;}
.lo-navitem{display:flex; align-items:center; gap:12px; padding:11px 12px; border-radius:13px; border:1px solid transparent;
  background:transparent; color:var(--dim); font-size:14.5px; font-weight:500; cursor:pointer; transition:.18s; text-align:left;}
.lo-navitem:hover{color:var(--text); background:rgba(255,255,255,.04);}
.lo-navitem.on{color:var(--text); background:var(--glass2); border-color:var(--line);
  box-shadow:inset 0 1px 0 rgba(255,255,255,.12);}
.lo-navitem.on svg{color:var(--amber);}
.lo-side-foot{display:flex; align-items:center; gap:10px; padding-top:14px; border-top:1px solid var(--line); margin-top:8px;}
.lo-avatar{width:34px;height:34px;border-radius:11px;display:grid;place-items:center;font-size:12px;font-weight:600;}
.lo-side-foot-txt{flex:1; min-width:0;}
.lo-side-foot-txt .nm{font-size:13.5px;font-weight:600; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;}
.lo-side-foot-txt .sub{font-size:11.5px;color:var(--faint);}
.lo-signout{background:transparent; border:none; color:var(--faint); cursor:pointer; padding:6px; border-radius:9px; display:grid; place-items:center;}
.lo-signout:hover{color:var(--text); background:rgba(255,255,255,.06);}

.lo-main{position:relative; z-index:2; flex:1; display:flex; flex-direction:column; min-width:0; padding:14px 14px 14px 18px;}
.lo-top{display:flex; align-items:flex-end; justify-content:space-between; gap:18px; padding:8px 6px 18px; flex-wrap:wrap;}
.lo-eyebrow{font-size:12px; color:var(--amber); font-weight:600; letter-spacing:.4px; text-transform:uppercase;}
.lo-h1{font-size:26px; font-weight:600; letter-spacing:-.5px; margin:4px 0 0;}
.lo-ask{display:flex; align-items:center; gap:9px; border-radius:14px; padding:10px 12px; min-width:280px; flex:1; max-width:420px; color:var(--dim);}
.lo-ask input{flex:1; background:transparent; border:none; outline:none; color:var(--text); font-size:13.5px; font-family:inherit;}
.lo-ask input::placeholder{color:var(--faint);}
.lo-ask-k{font-size:11px; color:var(--faint); border:1px solid var(--line); border-radius:6px; padding:1px 6px;}

.lo-scroll{flex:1; overflow:auto; padding:2px 6px 30px;}
.lo-grid{display:grid; grid-template-columns:1fr 1fr; gap:14px;}
.lo-card{border-radius:20px; padding:18px; min-width:0;}
.span2{grid-column:1 / -1;}
.lo-card-head{display:flex; align-items:center; justify-content:space-between; margin-bottom:13px;}
.lo-card-head h2{font-size:13px; font-weight:600; color:var(--dim); letter-spacing:.3px; text-transform:uppercase; margin:0;}
.lo-card-act{color:var(--faint); display:flex;}

.brief{background:linear-gradient(150deg,rgba(240,180,95,.10),rgba(255,255,255,.05));}
.brief-head{display:flex; align-items:center; gap:9px; font-weight:600; font-size:14px;}
.brief-head svg{color:var(--amber);}
.brief-lead{color:var(--dim); font-size:14px; margin:10px 0 14px; line-height:1.5;}
.brief-list{list-style:none; padding:0; margin:0; display:flex; flex-direction:column; gap:9px;}
.brief-list li{display:flex; align-items:center; gap:10px; font-size:13.5px;}
.tone-teal svg{color:var(--teal);} .tone-amber svg{color:var(--amber);}
.tone-violet svg{color:var(--violet);} .tone-dim{color:var(--faint);} .tone-dim svg{color:var(--faint);}
.brief-cta{margin-top:16px; display:inline-flex; align-items:center; gap:4px; background:rgba(255,255,255,.06);
  border:1px solid var(--line); color:var(--text); font-size:13px; font-weight:500; padding:8px 13px; border-radius:11px; cursor:pointer; font-family:inherit;}
.brief-cta:hover{background:rgba(255,255,255,.1);}

.lo-timeline{list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:11px;}
.lo-timeline li{display:flex;gap:13px;font-size:13.5px;}
.lo-timeline .t{color:var(--amber);font-weight:600;width:42px;flex:0 0 42px;}
.lo-timeline .d{color:var(--dim);}

.lo-tasks{list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:11px;}
.lo-tasks.big{gap:14px;}
.lo-tasks li{display:flex;align-items:center;gap:11px;}
.chk{width:20px;height:20px;flex:0 0 20px;border-radius:7px;border:1.5px solid var(--line);background:rgba(255,255,255,.03);
  cursor:pointer;display:grid;place-items:center;color:#1a130a;transition:.15s;}
.chk.on{background:linear-gradient(140deg,var(--amber),var(--amber2));border-color:transparent;}
.tk{min-width:0;flex:1;} .tt{font-size:14px;} .tm{font-size:11.5px;color:var(--faint);margin-top:1px;}
.tk.done .tt{text-decoration:line-through;color:var(--faint);}
.tcat{font-size:11px;color:var(--dim);border:1px solid var(--line);border-radius:7px;padding:3px 8px;}

.lo-money-glance{display:flex;gap:22px;margin-bottom:13px;}
.mgl{font-size:11.5px;color:var(--faint);} .mgv{font-size:19px;font-weight:600;letter-spacing:-.4px;margin-top:2px;}
.lo-bill{display:flex;align-items:center;gap:8px;font-size:13px;color:var(--dim);border-top:1px solid var(--line);padding-top:11px;}
.lo-bill svg{color:var(--amber);}

.approve{background:linear-gradient(150deg,rgba(173,147,230,.10),rgba(255,255,255,.05));}
.appr{display:flex;gap:11px;align-items:flex-start;} .appr svg{color:var(--violet);margin-top:2px;}
.appr-t{font-size:14px;font-weight:500;} .appr-s{font-size:12.5px;color:var(--faint);margin-top:2px;}
.appr-row{display:flex;gap:8px;margin-top:14px;}
.btn{flex:1;padding:9px;border-radius:11px;font-size:13px;font-weight:600;cursor:pointer;font-family:inherit;border:1px solid var(--line);}
.btn.ghost{background:rgba(255,255,255,.05);color:var(--text);}
.btn.solid{background:linear-gradient(140deg,var(--amber),var(--amber2));color:#1a130a;border-color:transparent;}

.lo-mail{list-style:none;padding:0;margin:0;display:flex;flex-direction:column;}
.lo-mail li{display:flex;align-items:center;gap:11px;padding:13px 4px;border-bottom:1px solid rgba(255,255,255,.07);}
.lo-mail li:last-child{border-bottom:none;}
.lo-mail .dot{width:7px;height:7px;border-radius:50%;background:var(--amber);flex:0 0 7px;box-shadow:0 0 8px var(--amber);}
.lo-mail li:not(.unread) .mi{margin-left:18px;}
.lo-mail .mi{color:var(--faint);}
.mc{flex:1;min-width:0;} .mtop{display:flex;align-items:center;gap:9px;}
.mf{font-size:13.5px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.lo-mail li:not(.unread) .mf{font-weight:500;color:var(--dim);}
.ms{font-size:12.5px;color:var(--faint);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-top:1px;}
.chip{font-size:10.5px;font-weight:600;border-radius:6px;padding:2px 7px;border:1px solid var(--line);white-space:nowrap;}
.chip.tone-teal{color:var(--teal);} .chip.tone-violet{color:var(--violet);}
.chip.tone-amber{color:var(--amber);} .chip.tone-dim{color:var(--faint);}
.msrc{font-size:11px;color:var(--faint);white-space:nowrap;}

.lo-acct-row{display:flex;gap:14px;flex-wrap:wrap;}
.acct{flex:1;min-width:120px;border:1px solid var(--line);border-radius:14px;padding:14px;background:rgba(255,255,255,.03);}
.al{font-size:12px;color:var(--faint);} .av{font-size:21px;font-weight:600;letter-spacing:-.5px;margin:5px 0 2px;}
.ai{font-size:11px;color:var(--faint);}
.lo-bills{list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:11px;}
.lo-bills li{display:flex;align-items:center;gap:9px;font-size:13.5px;color:var(--dim);}
.lo-bills li svg{color:var(--amber);} .lo-bills li span{margin-left:auto;color:var(--faint);font-size:12.5px;}

.soon{display:flex;flex-direction:column;align-items:center;text-align:center;gap:8px;padding:46px 20px;}
.soon svg{color:var(--amber);} .soon h2{font-size:17px;font-weight:600;margin:0;text-transform:none;letter-spacing:-.3px;}
.soon p{color:var(--faint);font-size:13.5px;max-width:340px;margin:0;line-height:1.5;}

.lo-demo{text-align:center;color:var(--faint);font-size:11.5px;margin-top:22px;letter-spacing:.3px;}

.lo-tabbar{display:none;}

@media (max-width:820px){
  .lo-side{display:none;}
  .lo-main{padding:12px 12px 86px;}
  .lo-grid{grid-template-columns:1fr;}
  .lo-h1{font-size:22px;}
  .lo-ask{min-width:0;max-width:none;width:100%;}
  .lo-tabbar{display:flex;position:fixed;z-index:5;left:14px;right:14px;bottom:14px;
    justify-content:space-around;padding:10px;border-radius:20px;}
  .lo-tab{background:transparent;border:none;color:var(--faint);padding:8px 14px;border-radius:12px;cursor:pointer;}
  .lo-tab.on{color:var(--amber);background:rgba(255,255,255,.07);}
}
@media (prefers-reduced-motion:reduce){ .lo-aurora .b{animation:none;} }
`;
