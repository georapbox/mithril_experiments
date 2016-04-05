(function (doc) {
    'use strict';

    var demo_1 = {};

    demo_1.controller = function () {
        return {
            value: m.prop(''),
            log: function (msg) {
                console.log(msg);
            },
            become: function (type) {
                this.value(type);
            }
        };
    };

    demo_1.view = function (ctrl) {
        function resolveType(value) {
            var cn = '',
                txt = '';

            switch (value) {
                case 'friend':
                    cn = 'btn-success';
                    txt = 'Go ahead buddy';
                    break;
                case 'enemy':
                    cn = 'btn-danger';
                    txt = 'Leave now SOAB';
                    break;
                default:
                    cn = 'btn-default';
                    txt = 'Neutral guy, do nothing';
            }

            return {
                className: cn,
                text: txt
            };
        }

        return [
            m('.row', [
                m('.col-lg-12', [
                    m('h4', 'Are you a friend or enemy?'),
                    m('form.form-inline', [
                        m('.btn-group', [
                            m('button.btn.btn-success', {onclick: ctrl.become.bind(ctrl, 'friend')}, 'Friend'),
                            m('button.btn.btn-default', {onclick: ctrl.become.bind(ctrl, 'neutral')}, 'Neutral'),
                            m('button.btn.btn-danger', {onclick: ctrl.become.bind(ctrl, 'enemy')}, 'Enemy')
                        ]),
                        m('br'), m('br'),
                        m('.form-group', [
                            m('input.form-control', {
                                type: 'text',
                                autofocus: true,
                                placeholder: 'Type and hit Enter',
                                onkeydown: function (e) {
                                    if (e.keyCode === 13) {
                                        e.preventDefault();
                                        ctrl.value(this.value);
                                    } else {
                                        m.redraw.strategy('none');
                                    }
                                },

                                value: ctrl.value()
                            })
                        ]),
                        m('button[type="button"].btn', {
                            className: resolveType(ctrl.value()).className,
                            onclick: ctrl.log.bind(ctrl, m.route())
                        }, resolveType(ctrl.value()).text)
                    ])
                ])
            ])
        ];
    };

    m.mount(doc.getElementById('demo_1'), demo_1);
}(document));


// Routing Demo
(function (doc) {
    'use strict';

    var Nav = {
        config: function (el, isInit, ctx) {
            el.classList.remove('active');
            if (el.getAttribute('id') === m.route().substr(1)) {
                el.classList.add('active');
            }
        },

        controller: function () {
            var links = [
                {id: 'home', url: '/home', text: 'Home'},
                {id: 'about', url: '/about', text: 'About'},
                {id: 'contact', url: '/contact', text: 'Contact'},
                {id: 'badge-config', url: '/badge-config', text: 'Badge Configurator'}
            ];

            return {
                links: links
            };
        },

        view: function (ctrl) {
            return [
                m('ul.nav.nav-tabs', [
                    ctrl.links.map(function (link) {
                        return (
                            m('li#' + link.id, {config: Nav.config, key: link.id}, [
                                m('a[data-index="test"][href="' + link.url + '"]', {config: m.route}, link.text + ' page')
                            ])
                        );
                    })
                ])
            ];
        }
    };

    var Home = {
        controller: function () {
            m.redraw.strategy('diff');
        },
        config: function (el, isInit, ctx) {
            function onbodyclick() {
                console.log('%cclicked on body element', 'color:#1967be;');
            }

            if (!isInit) {
                doc.body.addEventListener('click', onbodyclick, false);

                ctx.onunload = function onunload() {
                    console.log('%cremove custom event listener from body element', 'color:#cc002e;');
                    doc.body.removeEventListener('click', onbodyclick, false);
                };
            }
        },
        view: function () {
            return [
                m('h4', {config: Home.config}, [
                    m('i.glyphicon glyphicon-home')
                ], ' Home page'),
                m('p', 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Esse nesciunt voluptatum inventore. Quibusdam vero repudiandae distinctio eos ratione quidem fugit quaerat quas eligendi corporis, aliquid quia esse dolores earum. Possimus!'),
                m('p', [
                    m('a.btn.btn-primary[href="#/about"]', 'About', [
                        m('i.glyphicon glyphicon-chevron-right')
                    ])
                ])
            ];
        }
    };

    var About = {
        controller: function () {
            m.redraw.strategy('diff');
        },
        view: function () {
            return [
                m('h4', [
                    m('i.glyphicon glyphicon-user')
                ], ' About page'),
                m('p', 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ipsam incidunt ullam dolore minus fuga, inventore, quasi praesentium, amet quidem est quae laboriosam sunt eius nemo dicta, natus eligendi. Sapiente, error.'),
                m('p', [
                    m('a.btn.btn-warning[href="#/contact"]', 'Contact', [
                        m('i.glyphicon glyphicon-chevron-right')
                    ])
                ])
            ];
        }
    };

    var Contact = {
        controller: function () {
            m.redraw.strategy('diff');
        },
        view: function () {
            return [
                m('h4', [
                    m('i.glyphicon glyphicon-earphone')
                ], ' Contact page'),
                m('p', 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Vel porro rem eum nulla voluptatem adipisci minima delectus perspiciatis commodi quae quis doloremque illum fugit nesciunt mollitia, sint in voluptatibus voluptatum!'),
                m('p', [
                    m('a.btn.btn-info[href="#/badge-config"]', 'Badge Configurator', [
                        m('i.glyphicon glyphicon-chevron-right')
                    ])
                ])
            ];
        }
    };

    var BadgeConfig = {
        Badge: function () {
            this.text = m.prop('a|b|c|d');
            this.seperator = m.prop('');
            this.fields = m.prop([]);
        },

        utils: {
            str_count: function (str, subStr, caseInsensitive) {
                str += '';
                subStr += '';

                if (subStr.length <= 0) {
                    return str.length + 1;
                }

                // Case insensitive lookup.
                if (caseInsensitive === true) {
                    subStr = subStr.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                    return (str.match(new RegExp(subStr, 'gi')) || []).length;
                }

                // Case sensitive lookup.
                var n = 0,
                    pos = 0,
                    step = subStr.length;

                while (true) {
                    pos = str.indexOf(subStr, pos);

                    if (pos >= 0) {
                        n += 1;
                        pos += step;
                    } else {
                        break;
                    }
                }

                return n;
            }
        },

        styles: {
            fieldLabel: {
                display: 'inline-block',
                marginRight: '0.2em',
                marginBottom: '0.2em',
                padding: '0 1em',
                fontSize: '1em',
                fontWeight: 'normal',
                height: '2em',
                lineHeight: '2em',
                maxWidth: '150px',
                overflow: 'hidden',
                whiteSpace: 'no-wrap',
                textOverflow: 'ellipsis'
            },
            fieldsPre: {
                whiteSpace: 'pre-wrap'
            }
        },

        vm: (function () {
            var vm = {
                initBadge: function () {
                    return new BadgeConfig.Badge();
                },
                guess: function (textInput, seperators, characterInstances) {
                    var max = 0,
                        seperator,
                        occurrences;

                    occurrences = seperators.reduce(function (accum, value, index, array) {
                        var obj = {};
                        obj[array[index]] = BadgeConfig.utils.str_count(textInput, value);
                        accum.push(obj);
                        return accum;
                    }, []);

                    occurrences.forEach(function (item, index) {
                        Object.keys(item).forEach(function (key) {
                            if (item[key] >= max && item[key] > characterInstances) {
                                max = item[key];
                                seperator = key;
                            }
                        });
                    });

                    return seperator || '';
                },
                splitText: function (text, seperator) {
                    var isNotEmpty = function (str) {
                        return str !== '';
                    };

                    text = text.trim();
                    seperator = seperator.trim();
                    return (seperator !== '') ?
                        (text === '' ? [] : text.split(seperator).filter(isNotEmpty)) :
                        (text === '' ? [] : [text]);
                },
                onTextInput: function (ctrl, value) {
                    var seperatorStr;

                    ctrl.badge.text(value);

                    if (ctrl.badge.seperator().trim() === '') {
                        seperatorStr = ctrl.guess(value, ['$', '~', '^', '|'], 0);
                        ctrl.badge.seperator(seperatorStr);
                    } else {
                        seperatorStr = ctrl.badge.seperator();
                    }

                    ctrl.badge.fields(ctrl.splitText(value, seperatorStr));
                },
                onSeperatorInput: function (ctrl, value) {
                    ctrl.badge.seperator(value);
                    ctrl.badge.fields(ctrl.splitText(ctrl.badge.text(), value));
                }
            };

            return vm;
        }()),

        controller: function () {
            m.redraw.strategy('diff');

            return {
                badge: BadgeConfig.vm.initBadge(),
                guess: BadgeConfig.vm.guess,
                splitText: BadgeConfig.vm.splitText,
                onTextInput: BadgeConfig.vm.onTextInput,
                onSeperatorInput: BadgeConfig.vm.onSeperatorInput
            };
        },

        view: function (ctrl) {
            return [
                m('h4', [
                    m('i.glyphicon glyphicon-cog')
                ], ' Badge Configurator'),
                m('form', [
                    m('.form-group', [
                        m('textarea.form-control', {
                            placeholder: 'Free text',
                            value: ctrl.badge.text(),
                            oninput: m.withAttr('value', function (value) {
                                ctrl.onTextInput(ctrl, value);
                            }),
                            config: function (el, isInit, ctx) {
                                if (!isInit) {
                                    setTimeout(function () {
                                        m.startComputation();
                                        ctrl.onTextInput(ctrl, el.value);
                                        m.endComputation();
                                    }, 0);
                                }
                            }
                        })
                    ]),
                    m('.form-group', [
                        m('input.form-control', {
                            type: 'text',
                            placeholder: 'Seperator',
                            value: ctrl.badge.seperator(),
                            oninput: m.withAttr('value', function (value) {
                                ctrl.onSeperatorInput(ctrl, value);
                            })
                        })
                    ])
                ]),
                m('p', [
                    ctrl.badge.fields().filter(function (field) {
                        return field !== '';
                    }).map(function (field) {
                        return m('span.label.label-default', {
                            style: BadgeConfig.styles.fieldLabel
                        }, field);
                    })
                ]),
                m('p', [
                    m('pre', {
                        style: BadgeConfig.styles.fieldsPre
                    }, JSON.stringify(ctrl.badge.fields()))
                ]),
                m('p', 'Fields number: ', [
                    m('span.badge', ctrl.badge.fields().length)
                ]),
                m('p', [
                    m('a.btn.btn-danger[href="#/home"]', [
                        m('i.glyphicon glyphicon-chevron-left')
                    ], 'Home')
                ])
            ];
        }
    };

    m.route.mode = 'hash';

    m.mount(doc.getElementById('nav'), Nav);

    m.route(doc.getElementById('routing_demo'), '/home', {
        '/home': Home,
        '/about': About,
        '/contact': Contact,
        '/badge-config': BadgeConfig
    });
}(document));
