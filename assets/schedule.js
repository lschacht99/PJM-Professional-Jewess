/* Scheduling, messaging & account state for the app prototype.
   Everything persists in localStorage so the demo survives reloads.
   In production this is replaced by a real backend (see README:
   Cal.com / Cal.diy / Easy!Appointments for the scheduling core). */
(function () {
  var KEY = "pj_app_v1";

  var seed = {
    slots: [
      { id: "s1", start: "2026-07-28T11:00", mins: 30, type: "one", cap: 1, by: "mentor", note: "Intro call", attendees: [] },
      { id: "s2", start: "2026-07-29T14:30", mins: 30, type: "one", cap: 1, by: "mentor", note: "", attendees: [] },
      { id: "s3", start: "2026-08-02T20:00", mins: 45, type: "group", cap: 6, by: "mentor", note: "Group Q&A: surviving 1L year", attendees: ["Leah B.", "Devorah K."] },
      { id: "s4", start: "2026-08-04T10:00", mins: 30, type: "one", cap: 1, by: "mentee", note: "Proposed by Tova — resume review", attendees: [] }
    ],
    msgs: [
      { from: "mentor", text: "So glad we matched, Tova. Ask me anything before our call.", t: "Mon" }
    ],
    prefs: { email: true, sms: false },
    security: { emailVerified: false, phoneVerified: false, twofa: "" },
    log: []
  };

  function load() {
    try {
      var raw = localStorage.getItem(KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) { /* private mode etc. — fall through to seed */ }
    return JSON.parse(JSON.stringify(seed));
  }

  function save(state) {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* ignore */ }
  }

  function pad(n) { return (n < 10 ? "0" : "") + n; }

  function slotDates(slot) {
    var start = new Date(slot.start);
    var end = new Date(start.getTime() + slot.mins * 60000);
    return { start: start, end: end };
  }

  function fmt(slot) {
    var d = slotDates(slot).start;
    var days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var h = d.getHours() % 12 || 12;
    var ampm = d.getHours() < 12 ? "AM" : "PM";
    return days[d.getDay()] + ", " + months[d.getMonth()] + " " + d.getDate() +
      " · " + h + ":" + pad(d.getMinutes()) + " " + ampm;
  }

  /* Local "floating" timestamp — calendar apps book it in the viewer's timezone,
     which is what two people who agreed on "8:00 PM" both expect. */
  function stamp(d) {
    return "" + d.getFullYear() + pad(d.getMonth() + 1) + pad(d.getDate()) +
      "T" + pad(d.getHours()) + pad(d.getMinutes()) + "00";
  }

  function slotTitle(slot) {
    return slot.type === "group"
      ? "Group mentoring call · Professional Jewess"
      : "Mentoring call · Professional Jewess";
  }

  function gcalUrl(slot) {
    var d = slotDates(slot);
    return "https://calendar.google.com/calendar/render?action=TEMPLATE" +
      "&text=" + encodeURIComponent(slotTitle(slot)) +
      "&dates=" + stamp(d.start) + "/" + stamp(d.end) +
      "&details=" + encodeURIComponent((slot.note ? slot.note + "\n\n" : "") + "Booked on Professional Jewess.");
  }

  function downloadIcs(slot) {
    var d = slotDates(slot);
    var ics = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Professional Jewess//Scheduling//EN",
      "BEGIN:VEVENT",
      "UID:" + slot.id + "@professionaljewess",
      "DTSTAMP:" + stamp(new Date()) + "Z",
      "DTSTART:" + stamp(d.start),
      "DTEND:" + stamp(d.end),
      "SUMMARY:" + slotTitle(slot),
      "DESCRIPTION:" + (slot.note || "Booked on Professional Jewess.").replace(/\n/g, "\\n"),
      "END:VEVENT",
      "END:VCALENDAR"
    ].join("\r\n");
    var a = document.createElement("a");
    a.href = "data:text/calendar;charset=utf-8," + encodeURIComponent(ics);
    a.download = "pj-call.ics";
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  /* Prototype notification: records what a real backend would send, honoring
     the channels the member has opted into on her profile. */
  function notifyMatch(state, slot, who) {
    var channels = [];
    if (state.prefs.email) channels.push("email");
    if (state.prefs.sms) channels.push("phone");
    var msg = who + " matched “" + fmt(slot) + "”";
    state.log.unshift({ t: new Date().toISOString(), text: msg, channels: channels });
    return channels;
  }

  window.PJApp = {
    load: load,
    save: save,
    fmt: fmt,
    gcalUrl: gcalUrl,
    downloadIcs: downloadIcs,
    notifyMatch: notifyMatch,
    reset: function () { try { localStorage.removeItem(KEY); } catch (e) {} location.reload(); }
  };
})();
