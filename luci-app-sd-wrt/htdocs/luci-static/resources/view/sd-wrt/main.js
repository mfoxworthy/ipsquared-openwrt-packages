'use strict';
'require view';
'require poll';
'require rpc';

var callStatus = rpc.declare({
    object: 'luci.sd-wrt',
    method: 'status',
    expect: {}
});

function stateColor(state) {
    if (state === 'GOOD')      return '#4caf50';
    if (state === 'DEGRADED')  return '#ff9800';
    if (state === 'DOWN')      return '#f44336';
    return '#999';
}

function stateBadge(state) {
    return E('span', {
        style: 'display:inline-block;padding:2px 8px;border-radius:4px;' +
               'font-size:11px;font-weight:bold;color:#fff;' +
               'background:' + stateColor(state)
    }, state || 'UNKNOWN');
}

function latencyBar(latency) {
    var pct = Math.min(100, Math.round((latency / 2000) * 100));
    var color = latency < 200 ? '#4caf50' : latency < 800 ? '#ff9800' : '#f44336';
    return E('div', { style: 'background:#333;border-radius:3px;height:8px;width:120px;display:inline-block;vertical-align:middle;' }, [
        E('div', { style: 'background:' + color + ';height:100%;width:' + pct + '%;border-radius:3px;' })
    ]);
}

function renderStatus(data) {
    if (!data || typeof data !== 'object') return E('p', {}, 'No data');

    var links = data.links || {};
    var policy = data.active_policy || {};
    var events = data.events || [];

    var rows = [];
    Object.keys(links).forEach(function(name) {
        var l = links[name];
        rows.push(E('tr', {}, [
            E('td', { style: 'padding:8px 12px;font-weight:bold;' }, name),
            E('td', { style: 'padding:8px 12px;' }, stateBadge(l.state)),
            E('td', { style: 'padding:8px 12px;' }, [
                latencyBar(l.latency),
                E('span', { style: 'margin-left:8px;font-size:12px;' }, l.latency + ' ms')
            ]),
            E('td', { style: 'padding:8px 12px;' }, l.loss + '% loss'),
            E('td', { style: 'padding:8px 12px;color:#aaa;font-size:12px;' }, l.role)
        ]));
    });

    var linksTable = E('table', { style: 'width:100%;border-collapse:collapse;' }, [
        E('thead', {}, E('tr', { style: 'border-bottom:1px solid #444;color:#aaa;font-size:12px;' }, [
            E('th', { style: 'padding:6px 12px;text-align:left;' }, 'Link'),
            E('th', { style: 'padding:6px 12px;text-align:left;' }, 'State'),
            E('th', { style: 'padding:6px 12px;text-align:left;' }, 'Latency'),
            E('th', { style: 'padding:6px 12px;text-align:left;' }, 'Loss'),
            E('th', { style: 'padding:6px 12px;text-align:left;' }, 'Role')
        ])),
        E('tbody', {}, rows)
    ]);

    var policyDiv = E('div', { style: 'margin:16px 0;' }, [
        E('p', { style: 'margin:4px 0;' }, [
            E('strong', {}, 'Interactive traffic → '),
            E('span', {}, policy.interactive || '—')
        ]),
        E('p', { style: 'margin:4px 0;' }, [
            E('strong', {}, 'Default traffic → '),
            E('span', {}, policy['default'] || '—')
        ])
    ]);

    var eventItems = events.map(function(e) {
        return E('li', { style: 'font-family:monospace;font-size:12px;padding:2px 0;color:#ccc;' }, e);
    });
    var eventsDiv = eventItems.length
        ? E('ul', { style: 'list-style:none;margin:0;padding:0;' }, eventItems)
        : E('p', { style: 'color:#666;' }, 'No events yet.');

    return E('div', {}, [
        E('h3', { style: 'margin-top:0;' }, 'Link Quality'),
        linksTable,
        E('h3', {}, 'Active Routing Policy'),
        policyDiv,
        E('h3', {}, 'Recent Events'),
        eventsDiv
    ]);
}

return view.extend({
    load: function() {
        return callStatus();
    },

    render: function(data) {
        var container = E('div', { style: 'padding:16px;' }, renderStatus(data));

        poll.add(function() {
            return callStatus().then(function(d) {
                while (container.firstChild) container.removeChild(container.firstChild);
                container.appendChild(renderStatus(d));
            });
        }, 10);

        return container;
    },

    handleSaveApply: null,
    handleSave: null,
    handleReset: null
});
