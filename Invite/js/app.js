const storage = (table) => {

    if (!localStorage.getItem(table)) {
        localStorage.setItem(table, JSON.stringify({}));
    }

    const get = (key = null) => {
        let data = JSON.parse(localStorage.getItem(table));
        return key ? data[key] : data;
    };

    const set = (key, value) => {
        let storage = get();
        storage[key] = value;
        localStorage.setItem(table, JSON.stringify(storage));
    };

    const unset = (key) => {
        let storage = get();
        delete storage[key];
        localStorage.setItem(table, JSON.stringify(storage));
    };

    const has = (key) => Object.keys(get()).includes(key);

    return {
        get,
        set,
        unset,
        has,
    };
};

const request = (method, path) => {

    let url = document.querySelector('body').getAttribute('data-url');
    let req = {
        method: method.toUpperCase(),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    };

    if (url.slice(-1) == '/') {
        url = url.slice(0, -1);
    }

    return {
        async then(...params) {
            return fetch(url + path, req)
                .then((res) => res.json())
                .then((res) => {
                    if (res.error !== null) {
                        throw res.error[0];
                    }

                    return res;
                })
                .then(...params);
        },
        token(token) {
            req.headers['Authorization'] = 'Bearer ' + token;
            return this;
        },
        body(body) {
            req.body = JSON.stringify(body);
            return this;
        },
    };
};

const util = (() => {

    const opacity = (nama) => {
        let nm = document.getElementById(nama);
        let op = parseInt(nm.style.opacity);
        let clear = null;

        clear = setInterval(() => {
            if (op >= 0) {
                nm.style.opacity = op.toString();
                op -= 0.025;
            } else {
                clearInterval(clear);
                clear = null;
                nm.remove();
                return;
            }
        }, 10);
    };

    const escapeHtml = (unsafe) => {
        return unsafe
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    };

    const salin = (btn, msg = 'Tersalin', timeout = 1500) => {
        navigator.clipboard.writeText(btn.getAttribute('data-nomer'));

        let tmp = btn.innerHTML;
        btn.innerHTML = msg;
        btn.disabled = true;

        let clear = null;
        clear = setTimeout(() => {
            btn.innerHTML = tmp;
            btn.disabled = false;
            btn.focus();

            clearTimeout(clear);
            clear = null;
            return;
        }, timeout);
    };

    const timer = () => {
        let countDownDate = (new Date(document.getElementById('tampilan-waktu').getAttribute('data-waktu').replace(' ', 'T'))).getTime();

        setInterval(() => {
            let distance = Math.abs(countDownDate - (new Date()).getTime());

            document.getElementById('hari').innerText = Math.floor(distance / (1000 * 60 * 60 * 24));
            document.getElementById('jam').innerText = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            document.getElementById('menit').innerText = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            document.getElementById('detik').innerText = Math.floor((distance % (1000 * 60)) / 1000);
        }, 1000);
    };

    const music = (btn) => {
        if (btn.getAttribute('data-status') !== 'true') {
            btn.setAttribute('data-status', 'true');
            audio.play();
            btn.innerHTML = '<i class="fa-solid fa-circle-pause spin-button"></i>';
        } else {
            btn.setAttribute('data-status', 'false');
            audio.pause();
            btn.innerHTML = '<i class="fa-solid fa-circle-play"></i>';
        }
    };

    const modal = (img) => {
        document.getElementById('show-modal-image').src = img.src;
        (new bootstrap.Modal('#modal-image')).show();
    };

    const tamu = () => {
        let name = (new URLSearchParams(window.location.search)).get('to');

        if (!name) {
            document.getElementById('nama-tamu').remove();
            return;
        }

        let div = document.createElement('div');
        div.classList.add('m-2');
        div.innerHTML = `<p class="mt-0 mb-1 mx-0 p-0 text-light">Kepada Yth Bapak/Ibu/Saudara/i</p><h2 class="text-light">${escapeHtml(name)}</h2>`;

        document.getElementById('form-nama').value = name;
        document.getElementById('nama-tamu').appendChild(div);
    };

    const animation = async () => {
        const duration = 10 * 1000;
        const animationEnd = Date.now() + duration;
        let skew = 1;

        let randomInRange = (min, max) => {
            return Math.random() * (max - min) + min;
        };

        (async function frame() {
            const timeLeft = animationEnd - Date.now();
            const ticks = Math.max(200, 500 * (timeLeft / duration));

            skew = Math.max(0.8, skew - 0.001);

            await confetti({
                particleCount: 1,
                startVelocity: 0,
                ticks: ticks,
                origin: {
                    x: Math.random(),
                    y: Math.random() * skew - 0.2,
                },
                colors: ["FFC0CB", "FF69B4", "FF1493", "C71585"],
                shapes: ["heart"],
                gravity: randomInRange(0.5, 1),
                scalar: randomInRange(1, 2),
                drift: randomInRange(-0.5, 0.5),
            });

            if (timeLeft > 0) {
                requestAnimationFrame(frame);
            }
        })();
    };

    const buka = async (button) => {
        button.disabled = true;
        document.querySelector('body').style.overflowY = 'scroll';
        AOS.init();
        audio.play();
        if (localStorage.getItem('alertClosed')) {
            document.getElementById('alertDiv').style.display = 'none';
        }

        opacity('welcome');
        document.getElementById('tombol-musik').style.display = 'block';
        timer();

        await confetti({
            origin: { y: 0.8 },
            zIndex: 1057
        });
        await session.check();
        await animation();
    };

    const show = () => {
        tamu();
        opacity('loading');
        window.scrollTo(0, 0);
    };

    const animate = (svg, timeout, classes) => {
        let handler = null;

        handler = setTimeout(() => {
            svg.classList.add(classes);
            handler = null;
        }, timeout);
    };

    return {
        buka,
        modal,
        music,
        salin,
        escapeHtml,
        show,
        animate
    };
})();

const progress = (() => {

    const assets = document.querySelectorAll('img');
    const info = document.getElementById('progress-info');
    const bar = document.getElementById('bar');

    let total = assets.length;
    let loaded = 0;

    const progress = () => {
        loaded += 1;

        bar.style.width = Math.min((loaded / total) * 100, 100).toString() + "%";
        info.innerText = `Loading assets (${loaded}/${total}) [${parseInt(bar.style.width).toFixed(0)}%]`;

        if (loaded == total) {
            util.show();
        }
    };

    assets.forEach((asset) => {
        if (asset.complete && (asset.naturalWidth !== 0)) {
            progress();
        } else {
            asset.addEventListener('load', () => progress());
        }
    });
})();

const audio = (() => {
    let audio = null;

    const singleton = () => {
        if (!audio) {
            audio = new Audio();
            audio.src = document.getElementById('tombol-musik').getAttribute('data-url');
            audio.load();
            audio.currentTime = 0;
            audio.autoplay = true;
            audio.muted = false;
            audio.loop = true;
            audio.volume = 1;
        }

        return audio;
    };

    return {
        play: () => singleton().play(),
        pause: () => singleton().pause(),
    };
})();

const pagination = (() => {

    const perPage = 10;
    let pageNow = 0;
    let resultData = 0;

    const page = document.getElementById('page');
    const prev = document.getElementById('previous');
    const next = document.getElementById('next');

    const disabledPrevious = () => {
        prev.classList.add('disabled');
    };

    const disabledNext = () => {
        next.classList.add('disabled');
    };

    const buttonAction = async (button) => {
        let tmp = button.innerHTML;
        button.disabled = true;
        button.innerHTML = `<span class="spinner-border spinner-border-sm me-1"></span>Loading...`;
        await comment.ucapan();
        document.getElementById('daftar-ucapan').scrollIntoView({ behavior: 'smooth' });
        button.disabled = false;
        button.innerHTML = tmp;
    };

    return {
        getPer: () => {
            return perPage;
        },
        getNext: () => {
            return pageNow;
        },
        reset: async () => {
            pageNow = 0;
            resultData = 0;
            page.innerText = 1;
            next.classList.remove('disabled');
            await comment.ucapan();
            disabledPrevious();
        },
        setResultData: (len) => {
            resultData = len;
            if (resultData < perPage) {
                disabledNext();
            }
        },
        previous: async (button) => {
            if (pageNow < 0) {
                disabledPrevious();
            } else {
                pageNow -= perPage;
                disabledNext();
                await buttonAction(button);
                page.innerText = parseInt(page.innerText) - 1;
                next.classList.remove('disabled');
                if (pageNow <= 0) {
                    disabledPrevious();
                }
            }
        },
        next: async (button) => {
            if (resultData < perPage) {
                disabledNext();
            } else {
                pageNow += perPage;
                disabledPrevious();
                await buttonAction(button);
                page.innerText = parseInt(page.innerText) + 1;
                prev.classList.remove('disabled');
            }
        }
    };
})();

const session = (() => {

    let body = document.querySelector('body');

    const login = async () => {
        await request('POST', '/api/session')
            .body({
                email: body.getAttribute('data-email'),
                password: body.getAttribute('data-password')
            })
            .then((res) => {
                if (res.code == 200) {
                    localStorage.removeItem('token');
                    localStorage.setItem('token', res.data.token);
                    comment.ucapan();
                }
            })
            .catch((err) => {
                // alert(`Terdapat kesalahan: ${err}`);
                // window.location.reload();
                return;
            });
    };

    const check = async () => {
        const token = localStorage.getItem('token');

        if (token) {
            const jwt = JSON.parse(atob(token.split('.')[1]));

            if (jwt.exp < ((new Date()).getTime() / 1000) || !jwt.iss.includes((new URL(window.location.href)).host)) {
                await login();
            } else {
                await comment.ucapan();
            }
        } else {
            await login();
        }
    };

    return { check };
})();

const like = (() => {

    const likes = storage('likes');

    const like = async (button) => {
        let token = localStorage.getItem('token');
        let id = button.getAttribute('data-uuid');

        if (!token) {
            alert('Terdapat kesalahan, token kosong !');
            window.location.reload();
            return;
        }

        let heart = button.firstElementChild.lastElementChild;
        let info = button.firstElementChild.firstElementChild;

        button.disabled = true;
        info.innerText = 'Loading..';

        if (likes.has(id)) {
            await request('PATCH', '/api/comment/' + likes.get(id))
                .token(token)
                .then((res) => {
                    if (res.data.status) {
                        likes.unset(id);

                        heart.classList.remove('fa-solid', 'text-danger');
                        heart.classList.add('fa-regular');

                        info.setAttribute('data-suka', (parseInt(info.getAttribute('data-suka')) - 1).toString());
                    }
                })
                .catch((err) => {
                    alert(`Terdapat kesalahan: ${err}`);
                });

        } else {
            await request('POST', '/api/comment/' + id)
                .token(token)
                .then((res) => {
                    if (res.code == 201) {
                        likes.set(id, res.data.uuid);

                        heart.classList.remove('fa-regular');
                        heart.classList.add('fa-solid', 'text-danger');

                        info.setAttribute('data-suka', (parseInt(info.getAttribute('data-suka')) + 1).toString());
                    }
                })
                .catch((err) => {
                    alert(`Terdapat kesalahan: ${err}`);
                });
        }

        info.innerText = info.getAttribute('data-suka') + ' suka';
        button.disabled = false;
    };

    return { like };
})();

const comment = (() => {
    const buttonBatal = document.getElementById('batal');
    const buttonBalas = document.getElementById('balas');
    const buttonUbah = document.getElementById('ubah');
    const buttonKirim = document.getElementById('kirim');

    const formKehadiran = document.getElementById('form-kehadiran');
    const formNama = document.getElementById('form-nama');
    const formPesan = document.getElementById('form-pesan');

    const owns = storage('owns');
    const likes = storage('likes');

    const loader = `<span class="spinner-border spinner-border-sm me-1"></span>Loading...`;

    let temporaryID = null;

    const convertMarkdownToHTML = (input) => {
        return input
            .replace(/\*(?=\S)(.*?)(?<!\s)\*/s, '<strong class="text-dark">$1</strong>')
            .replace(/\_(?=\S)(.*?)(?<!\s)\_/s, '<em class="text-dark">$1</em>')
            .replace(/\~(?=\S)(.*?)(?<!\s)\~/s, '<del class="text-dark">$1</del>')
            .replace(/\`\`\`(?=\S)(.*?)(?<!\s)\`\`\`/s, '<code class="font-monospace text-dark">$1</code>');
    };

    const resetForm = () => {

        buttonBatal.style.display = 'none';
        buttonBalas.style.display = 'none';
        buttonUbah.style.display = 'none';
        buttonKirim.style.display = 'block';

        document.getElementById('label-kehadiran').style.display = 'block';
        document.getElementById('balasan').innerHTML = null;
        formKehadiran.style.display = 'block';

        formNama.value = null;
        formKehadiran.value = 0;
        formPesan.value = null;

        formNama.disabled = false;
        formKehadiran.disabled = false;
        formPesan.disabled = false;
    };

    const kirim = async () => {
        let nama = formNama.value;
        let hadir = parseInt(formKehadiran.value);
        let komentar = formPesan.value;
        let token = localStorage.getItem('token') ?? '';

        if (token.length == 0) {
            alert('Terdapat kesalahan, token kosong !');
            window.location.reload();
            return;
        }

        if (nama.length == 0) {
            alert('nama tidak boleh kosong');
            return;
        }

        if (nama.length >= 35) {
            alert('panjangan nama maksimal 35');
            return;
        }

        if (hadir == 0) {
            alert('silahkan pilih kehadiran');
            return;
        }

        if (komentar.length == 0) {
            alert('pesan tidak boleh kosong');
            return;
        }

        formNama.disabled = true;
        formKehadiran.disabled = true;
        formPesan.disabled = true;
        buttonKirim.disabled = true;

        let tmp = buttonKirim.innerHTML;
        buttonKirim.innerHTML = loader;

        let isSuccess = false;
        await request('POST', '/api/comment')
            .token(token)
            .body({
                nama: nama,
                hadir: hadir == 1,
                komentar: komentar
            })
            .then((res) => {
                if (res.code == 201) {
                    owns.set(res.data.uuid, res.data.own);
                    isSuccess = true;
                }
            })
            .catch((err) => {
                alert(`Terdapat kesalahan: ${err}`);
            });

        if (isSuccess) {
            await pagination.reset();
            document.getElementById('daftar-ucapan').scrollIntoView({ behavior: 'smooth' });
            resetForm();
        }

        buttonKirim.disabled = false;
        buttonKirim.innerHTML = tmp;
        formNama.disabled = false;
        formKehadiran.disabled = false;
        formPesan.disabled = false;
    };

    const balasan = async (button) => {
        resetForm();

        button.disabled = true;
        let tmp = button.innerText;
        button.innerText = 'Loading...';

        let id = button.getAttribute('data-uuid');
        let token = localStorage.getItem('token') ?? '';

        if (token.length == 0) {
            alert('Terdapat kesalahan, token kosong !');
            window.location.reload();
            return;
        }

        document.getElementById('balasan').innerHTML = renderLoading(1);
        formKehadiran.style.display = 'none';
        document.getElementById('label-kehadiran').style.display = 'none';

        await request('GET', '/api/comment/' + id)
            .token(token)
            .then((res) => {
                if (res.code == 200) {
                    buttonKirim.style.display = 'none';
                    buttonBatal.style.display = 'block';
                    buttonBalas.style.display = 'block';

                    temporaryID = id;

                    document.getElementById('balasan').innerHTML = `
                    <div class="my-3">
                        <h6>Balasan</h6>
                        <div id="id-balasan" data-uuid="${id}" class="card-body bg-light shadow p-3 rounded-4">
                            <div class="d-flex flex-wrap justify-content-between align-items-center">
                                <p class="text-dark text-truncate m-0 p-0" style="font-size: 0.95rem;">
                                    <strong>${util.escapeHtml(res.data.nama)}</strong>
                                </p>
                                <small class="text-dark m-0 p-0" style="font-size: 0.75rem;">${res.data.created_at}</small>
                            </div>
                            <hr class="text-dark my-1">
                            <p class="text-dark m-0 p-0" style="white-space: pre-line">${convertMarkdownToHTML(util.escapeHtml(res.data.komentar))}</p>
                        </div>
                    </div>`;
                }
            })
            .catch((err) => {
                resetForm();
                alert(`Terdapat kesalahan: ${err}`);
            });

        document.getElementById('ucapan').scrollIntoView({ behavior: 'smooth' });
        button.disabled = false;
        button.innerText = tmp;
    };

    const innerComment = (data) => {
        return `
        <div class="d-flex flex-wrap justify-content-between align-items-center">
            <div class="d-flex flex-wrap justify-content-start align-items-center">
                <button style="font-size: 0.8rem;" onclick="comment.balasan(this)" data-uuid="${data.uuid}" class="btn btn-sm btn-outline-dark rounded-3 py-0">Balas</button>
                ${owns.has(data.uuid)
                ? `
                <button style="font-size: 0.8rem;" onclick="comment.edit(this)" data-uuid="${data.uuid}" class="btn btn-sm btn-outline-dark rounded-3 py-0 ms-1">Ubah</button>
                <button style="font-size: 0.8rem;" onclick="comment.hapus(this)" data-uuid="${data.uuid}" class="btn btn-sm btn-outline-dark rounded-3 py-0 ms-1">Hapus</button>`
                : ''}
            </div>
            <button style="font-size: 0.8rem;" onclick="like.like(this)" data-uuid="${data.uuid}" class="btn btn-sm btn-outline-dark rounded-2 py-0 px-0">
                <div class="d-flex justify-content-start align-items-center">
                    <p class="my-0 mx-1" data-suka="${data.like.love}">${data.like.love} suka</p>
                    <i class="py-1 me-1 p-0 ${likes.has(data.uuid) ? 'fa-solid fa-heart text-danger' : 'fa-regular fa-heart'}"></i>
                </div>
            </button>
        </div>
        ${innerCard(data.comments)}`;
    };

    const innerCard = (comment) => {
        let result = '';

        comment.forEach((data) => {
            result += `
            <div class="card-body border-start bg-light py-2 ps-2 pe-0 my-2 ms-2 me-0" id="${data.uuid}">
                <div class="d-flex flex-wrap justify-content-between align-items-center">
                    <p class="text-dark text-truncate m-0 p-0" style="font-size: 0.95rem;">
                        <strong>${util.escapeHtml(data.nama)}</strong>
                    </p>
                    <small class="text-dark m-0 p-0" style="font-size: 0.75rem;">${data.created_at}</small>
                </div>
                <hr class="text-dark my-1">
                <p class="text-dark mt-0 mb-1 mx-0 p-0" style="white-space: pre-line">${convertMarkdownToHTML(util.escapeHtml(data.komentar))}</p>
                ${innerComment(data)}
            </div>`;
        });

        return result;
    };

    const renderCard = (data) => {
        const DIV = document.createElement('div');
        DIV.classList.add('mb-3');
        DIV.innerHTML = `
        <div class="card-body bg-light shadow p-3 m-0 rounded-4" data-parent="true" id="${data.uuid}">
            <div class="d-flex flex-wrap justify-content-between align-items-center">
                <p class="text-dark text-truncate m-0 p-0" style="font-size: 0.95rem;">
                    <strong class="me-1">${util.escapeHtml(data.nama)}</strong><i class="fa-solid ${data.hadir ? 'fa-circle-check text-success' : 'fa-circle-xmark text-danger'}"></i>
                </p>
                <small class="text-dark m-0 p-0" style="font-size: 0.75rem;">${data.created_at}</small>
            </div>
            <hr class="text-dark my-1">
            <p class="text-dark mt-0 mb-1 mx-0 p-0" style="white-space: pre-line">${convertMarkdownToHTML(util.escapeHtml(data.komentar))}</p>
            ${innerComment(data)}
        </div>`;
        return DIV;
    };

    const ucapan = async () => {
        const UCAPAN = document.getElementById('daftar-ucapan');
        UCAPAN.innerHTML = renderLoading(pagination.getPer());

        let token = localStorage.getItem('token') ?? '';
        if (token.length == 0) {
            alert('Terdapat kesalahan, token kosong !');
            window.location.reload();
            return;
        }

        await request('GET', `/api/comment?per=${pagination.getPer()}&next=${pagination.getNext()}`)
            .token(token)
            .then((res) => {
                if (res.code == 200) {
                    UCAPAN.innerHTML = null;
                    res.data.forEach((data) => UCAPAN.appendChild(renderCard(data)));
                    pagination.setResultData(res.data.length);

                    if (res.data.length == 0) {
                        UCAPAN.innerHTML = `<div class="h6 text-center">Tidak ada data</div>`;
                    }
                }
            })
            .catch((err) => alert(`Terdapat kesalahan: ${err}`));
    };

    const renderLoading = (num) => {
        let result = '';

        for (let index = 0; index < num; index++) {
            result += `
            <div class="mb-3">
                <div class="card-body bg-light shadow p-3 m-0 rounded-4">
                    <div class="d-flex flex-wrap justify-content-between align-items-center placeholder-glow">
                        <span class="placeholder bg-secondary col-5"></span>
                        <span class="placeholder bg-secondary col-3"></span>
                    </div>
                    <hr class="text-dark my-1">
                    <p class="card-text placeholder-glow">
                        <span class="placeholder bg-secondary col-6"></span>
                        <span class="placeholder bg-secondary col-5"></span>
                        <span class="placeholder bg-secondary col-12"></span>
                    </p>
                </div>
            </div>`;
        }

        return result;
    };

    const balas = async () => {
        let nama = formNama.value;
        let komentar = formPesan.value;
        let token = localStorage.getItem('token') ?? '';
        let id = document.getElementById('id-balasan').getAttribute('data-uuid');

        if (token.length == 0) {
            alert('Terdapat kesalahan, token kosong !');
            window.location.reload();
            return;
        }

        if (nama.length == 0) {
            alert('nama tidak boleh kosong');
            return;
        }

        if (nama.length >= 35) {
            alert('panjangan nama maksimal 35');
            return;
        }

        if (komentar.length == 0) {
            alert('pesan tidak boleh kosong');
            return;
        }

        formNama.disabled = true;
        formPesan.disabled = true;

        buttonBatal.disabled = true;
        buttonBalas.disabled = true;
        let tmp = buttonBalas.innerHTML;
        buttonBalas.innerHTML = loader;

        let isSuccess = false;
        await request('POST', '/api/comment')
            .token(token)
            .body({
                nama: nama,
                id: id,
                komentar: komentar
            })
            .then((res) => {
                if (res.code == 201) {
                    isSuccess = true;
                    owns.set(res.data.uuid, res.data.own);
                }
            })
            .catch((err) => {
                alert(`Terdapat kesalahan: ${err}`);
            });

        if (isSuccess) {
            await ucapan();
            document.getElementById(id).scrollIntoView({ behavior: 'smooth', block: 'center' });
            resetForm();
        }

        buttonBatal.disabled = false;
        buttonBalas.disabled = false;
        buttonBalas.innerHTML = tmp;
        formNama.disabled = false;
        formPesan.disabled = false;
    };

    const ubah = async () => {
        let token = localStorage.getItem('token') ?? '';
        let id = buttonUbah.getAttribute('data-uuid');
        let hadir = formKehadiran.value;
        let komentar = formPesan.value;

        if (token.length == 0) {
            alert('Terdapat kesalahan, token kosong !');
            window.location.reload();
            return;
        }

        if (document.getElementById(id).getAttribute('data-parent') === 'true' && hadir == 0) {
            alert('silahkan pilih kehadiran');
            return;
        }

        if (komentar.length == 0) {
            alert('pesan tidak boleh kosong');
            return;
        }

        formKehadiran.disabled = true;
        formPesan.disabled = true;

        buttonUbah.disabled = true;
        buttonBatal.disabled = true;
        let tmp = buttonUbah.innerHTML;
        buttonUbah.innerHTML = loader;

        let isSuccess = false;
        await request('PUT', '/api/comment/' + owns.get(id))
            .body({
                hadir: parseInt(hadir) == 1,
                komentar: komentar
            })
            .token(token)
            .then((res) => {
                if (res.data.status) {
                    isSuccess = true;
                }
            })
            .catch((err) => {
                alert(`Terdapat kesalahan: ${err}`);
            });

        if (isSuccess) {
            await ucapan();
            document.getElementById(id).scrollIntoView({ behavior: 'smooth', block: 'center' });
            resetForm();
        }

        buttonUbah.innerHTML = tmp;
        buttonUbah.disabled = false;
        buttonBatal.disabled = false;
        formKehadiran.disabled = false;
        formPesan.disabled = false;
    };

    const hapus = async (button) => {
        if (!confirm('Kamu yakin ingin menghapus?')) {
            return;
        }

        let token = localStorage.getItem('token') ?? '';
        let id = button.getAttribute('data-uuid');

        if (token.length == 0) {
            alert('Terdapat kesalahan, token kosong !');
            window.location.reload();
            return;
        }

        resetForm();

        button.disabled = true;
        let tmp = button.innerText;
        button.innerText = 'Loading..';

        await request('DELETE', '/api/comment/' + owns.get(id))
            .token(token)
            .then((res) => {
                if (res.data.status) {
                    owns.unset(id);
                    document.getElementById(id).remove();
                }
            })
            .catch((err) => {
                alert(`Terdapat kesalahan: ${err}`);
            });

        button.innerText = tmp;
        button.disabled = false;
    };

    const edit = async (button) => {
        resetForm();

        button.disabled = true;
        let tmp = button.innerText;
        button.innerText = 'Loading...';

        let id = button.getAttribute('data-uuid').toString();
        let token = localStorage.getItem('token') ?? '';

        if (token.length == 0) {
            alert('Terdapat kesalahan, token kosong !');
            window.location.reload();
            return;
        }

        await request('GET', '/api/comment/' + id)
            .token(token)
            .then((res) => {
                if (res.code == 200) {
                    temporaryID = id;

                    buttonBatal.style.display = 'block';
                    buttonUbah.style.display = 'block';
                    buttonKirim.style.display = 'none';
                    buttonUbah.setAttribute('data-uuid', id);

                    formPesan.value = res.data.komentar;
                    formNama.value = res.data.nama;
                    formNama.disabled = true;

                    if (document.getElementById(id).getAttribute('data-parent') !== 'true') {
                        document.getElementById('label-kehadiran').style.display = 'none';
                        formKehadiran.style.display = 'none';
                    } else {
                        formKehadiran.value = res.data.hadir ? 1 : 2;
                        document.getElementById('label-kehadiran').style.display = 'block';
                        formKehadiran.style.display = 'block';
                    }

                    document.getElementById('ucapan').scrollIntoView({ behavior: 'smooth' });
                }
            })
            .catch((err) => {
                alert(`Terdapat kesalahan: ${err}`);
            });

        button.disabled = false;
        button.innerText = tmp;
    };

    const batal = () => {
        if (temporaryID) {
            document.getElementById(temporaryID).scrollIntoView({ behavior: 'smooth', block: 'center' });
            temporaryID = null;
        }

        resetForm();
    };

    return {
        ucapan,
        renderLoading,
        balasan,
        hapus,
        edit,
        batal,
        balas,
        ubah,
        kirim,
    };
})();


window.onload = function () {
    document.querySelector("#hide-btn").click();
}

//  ****************Load YouTube Player API code asynchronously****************

//  var tag = document.createElement('script');
//  tag.src = "https://www.youtube.com/iframe_api";
//  var firstScriptTag = document.getElementsByTagName('script')[0];
//  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

//  // YouTube Player API code
//  var player;
//  function onYouTubeIframeAPIReady() {
//      player = new YT.Player('bgndVideo', {
//          height: '100%', // Set the height to 100% for full width
//          width: '100%',
//          videoId: 'eehISH4VfTQ', // Replace with the correct video ID
//          playerVars: {
//              'autoplay': 1,
//              'controls': 0,
//              'showinfo': 0,
//              'rel': 0,
//              'mute': 1,
//              'loop': 1,
//              'start': 136 // Start at 136 seconds
//          },
//          events: {
//              'onReady': onPlayerReady
//          }
//      });
//  }

//  function onPlayerReady(event) {
//      event.target.playVideo();
//      // Disable player controls
//      event.target.setPlaybackQuality('hd1080');
//      event.target.setPlaybackQuality('small');
//      event.target.setPlaybackQuality('medium');
//      event.target.setPlaybackQuality('large');
//  }


const effect = document.querySelector(".effect");

const buttons = document.querySelectorAll(".navbar button:not(.plus)");

buttons.forEach((button) => {
    button.addEventListener("click", (e) => {
        const x = e.target.offsetLeft;

        buttons.forEach((btn) => {
            btn.classList.remove("active");
        });

        e.target.classList.add("active");

        anime({
            targets: ".effect",
            left: `${x}px`,
            opacity: 1,
            duration: 600,
        });
    });
});


// Function to open the food popup and populate it with content
function openPopup(title, brideDishes, groomDishes) {
    // Set the header title with a food icon
    var popupHeader = document.querySelector('.popup-header');
    // Choose the appropriate food icon class from Font Awesome
    var foodIconClass = 'fas fa-utensils'; // Example: 'fas fa-utensils' for utensils icon
    popupHeader.innerHTML = '<i class="' + foodIconClass + ' food-icon"></i> ' + title;

    // Helper function to format dishes into list items with circle icons
    function formatDishesWithColumns(dishes) {
        var formattedContent = '';
        for (var i = 0; i < dishes.length; i++) {
            if (i % 3 === 0 && i !== 0) {
                formattedContent += '</ul><ul class="list-unstyled row">';
            }
            formattedContent += '<li class="col-4"><i class="fas fa-circle"></i> ' + dishes[i] + '</li>';
        }
        return formattedContent;
    }

    var brideContent = '<ul class="list-unstyled row">' + formatDishesWithColumns(brideDishes) + '</ul>';
    var groomContent = '<ul class="list-unstyled row">' + formatDishesWithColumns(groomDishes) + '</ul>';
   
    document.querySelector("#brideItems").innerHTML = brideContent;
    document.querySelector("#groomItems").innerHTML = groomContent;
 
    $('#popup').modal('show');
}
function closePopup() {
    $('#popup').modal('hide');
}

// Function to set the top position of the vertical line dynamically
function setVerticalLineHeight() {
    var popupColumns = document.querySelector('.popup-columns');
    if (popupColumns) {
        var brideList = document.querySelector("#brideDishes ul");
        var groomList = document.querySelector("#groomDishes ul");

        if (brideList && groomList) {
            // Get the top position of the lists
            var brideTop = brideList.getBoundingClientRect().top;
            var groomTop = groomList.getBoundingClientRect().top;

            var lineStart = Math.min(brideTop, groomTop);
            var verticalLineTop = brideTop - lineStart - 20;
            document.querySelector('.popup-columns::before').style.top = verticalLineTop + 'px';
        }
    }
}

const apiUrl = "https://ajith-marriage-api.azurewebsites.net/api/v1";
// const apiUrl = "http://localhost:8081/api/v1";

async function showApiErr(resp) {
    const errTxt = await resp.text();
    const err = JSON.parse(errTxt);
    alert((err.message || err.error) || errTxt);
}

/**
 * 
 * @returns {string | null};
 */
function getAccessToken() {
    return localStorage.getItem('accessToken');
}

/**
 * 
 * @param {string} accessToken 
 */
function setAccessToken(accessToken) {
    localStorage.setItem('accessToken', accessToken);
}

/**
 * 
 * @returns {Headers}
 */
function getHeaders() {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    const accessToken = getAccessToken();
    if (accessToken) {
        myHeaders.append("Authorization", `Bearer ${accessToken}`)
    }
    return myHeaders;
}

/**
 * 
 * @param {string} mobileNumber 
 * @returns 
 */
async function sendOtp(mobileNumber) {
    if (getAccessToken()) {
        alert('Already initialized');
        return;
    }

    const resp = await fetch(`${apiUrl}/auth/send-otp`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({
            mobileNumber
        })
    });
    if (resp.ok) {
        alert('OTP Sent');
    } else {
        await showApiErr(resp);
    }
}

/**
 * 
 * @param {string} mobileNumber 
 * @param {string} otp 
 * @returns 
 */
async function verifyOtp(mobileNumber, otp, callBack) {
    const resp = await fetch(`${apiUrl}/auth/verify-otp`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({
            mobileNumber,
            otp
        })
    });
    if (resp.ok) {
        const { accessToken } = await resp.json();
        if (accessToken) setAccessToken(accessToken);
        if (typeof callBack === 'function') {
            callBack();
        }
    } else {
        await showApiErr(resp);
    }
}

/**
 * 
 * @param {string} mobileNumber 
 * @param {string} otp 
 * @param {string} name 
 * @param {boolean} isAttend 
 * @param {string} relationType 
 * @param {string} colleagueRef 
 * @param {string} message 
 * @returns 
 */
async function initialize(mobileNumber, otp, name, isAttend, relationType, colleagueRef = "", message = "") {
    if (getAccessToken()) {
        alert('Already initialized');
        return;
    }
    const resp = await fetch(`${apiUrl}/auth/init`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({
            mobileNumber,
            otp,
            message,
            name,
            isAttend,
            relationType,
            colleagueRef
        })
    });
    if (resp.ok) {
        const { accessToken } = await resp.json();
        if (accessToken) setAccessToken(accessToken);
        alert('Done');
    } else {
        alert(await resp.text());
    }
}

window.totalComments = 0;
/**
 * 
 * @param {number} offset 
 * @returns {object}
 */
async function getComments(offset = 0) {
    // if (!getAccessToken()) {
    //     alert('Please initialize first');
    //     return;
    // }
    const queryParams = new URLSearchParams();
    queryParams.append("limit", 30);
    queryParams.append("offset", offset);
    const resp = await fetch(`${apiUrl}/comments?${queryParams.toString()}`, {
        headers: getHeaders()
    });
    if (resp.ok) {
        const respData = await resp.json();
        window.totalComments = respData.total;
        return respData;
    } else {
        return [];
    }
}


/**
 * 
 * @param {string} commentId 
 * @param {number} offset 
 * @returns {object}
 */
async function getReplies(commentId, offset = 0) {
    const queryParams = new URLSearchParams();
    queryParams.append("limit", 100);
    queryParams.append("offset", offset);
    const resp = await fetch(`${apiUrl}/comments/${commentId}/replies?${queryParams.toString()}`, {
        headers: getHeaders()
    });
    if (resp.ok) {
        return await resp.json();
    } else {
        return [];
    }
}

/**
 * 
 * @param {string} message 
 * @param {string} parentCommentId 
 */
async function addComment(message, parentCommentId = "") {
    const resp = await fetch(`${apiUrl}/comments`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({
            message,
            commentId: parentCommentId || undefined
        })
    })
    if (!resp.ok) {
        alert(await resp.text());
    }
}

/**
 * 
 * @param {string} message 
 * @param {string} commentId 
 */

async function editComment(commentId, message) {
    const newMessage = prompt('Edit your comment:', message);
    if (newMessage) {
        try {
            const resp =  await fetch(`${apiUrl}/comments/${commentId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getAccessToken()}`
                },
                body: JSON.stringify({ message: newMessage })
            });
            if (resp.ok) {
                alert('Comment edited successfully');
                renderComment(true);
            } else {
                alert(await resp.text());
            }
        } catch (error) {
            console.error('Error editing comment:', error);
            alert('An error occurred while editing the comment.');
        }
    }
}

/**
 * 
 * @param {string} commentId 
 */
async function deleteComment(commentId) {
    if (confirm('Are you sure you want to delete this comment?')) {
        try {
            const resp = await fetch(`${apiUrl}/comments/${commentId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${getAccessToken()}`
                }
            });
            if (resp.ok) {
                alert('Comment deleted successfully');
                renderComment(true);
            } else {
                alert("Cannot delete other messages");
            }
        } catch (error) {
            console.error('Error deleting comment:', error);
            alert('An error occurred while deleting the comment.');
        }
    }
}
/**
 * 
 * @param {number} score 
 */
async function saveScore(score) {
    const resp = await fetch(`${apiUrl}/auth/save-score`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({
            score
        })
    })
    if (resp.ok) {
        alert('Score saved');
    } else {
        alert(await resp.text());
    }
}

async function getScoreBoard() {
    const resp = await fetch(`${apiUrl}/auth/score-board`, {
        headers: getHeaders()
    });
    if (resp.ok) {
        return await resp.json();
    } else {
        return [];
    }
}

async function getAttendees() {
    const resp = await fetch(`${apiUrl}/auth/attendees`, {
        headers: getHeaders()
    });
    if (resp.ok) {
        return await resp.json();
    } else {
        return [];
    }
}

/**
 * 
 * @param {boolean} isAttend 
 */
async function makeMyAvailability(isAttend) {
    await fetch(`${apiUrl}/auth/make-my-availability`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({
            isAttend
        })
    });
}

function resetFormInput() {
    $('#phoneNumber').val('');
    $('#otp').val('');
    $('#relationType').val('').change();
    $('#uname').val('');
    $('#colleagueRef').val('');
    $('#comments').val('');
    $('#isAttend').prop('checked', false);
}


let cachedComments = [];
let cachedAttendees = [];

const cacheData = (key, data) => {
    localStorage.setItem(key, JSON.stringify(data));
};

const getCachedData = (key) => {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
};

const showLoader = (selector) => {
    $(selector).append('<div class="loader">Loading...</div>');
};

const hideLoader = (selector) => {
    $(selector).find('.loader').remove();
};

const fetchComments = async (offset = 0) => {
    if (cachedComments.length === 0 || offset === 0) {
        const commentResponse = await getComments(offset);
        cachedComments = offset === 0 ? commentResponse.comments : cachedComments.concat(commentResponse.comments);
        cacheData('comments', cachedComments);
    }
    return cachedComments;
};

const fetchAttendees = async () => {
    if (cachedAttendees.length === 0) {
        const attendeeResponse = await getAttendees();        
        cachedAttendees = attendeeResponse.users;
        cacheData('attendees', cachedAttendees);
    }
    return cachedAttendees;
};

const filterData = (data, filters) => {
    return data.filter(item => {
        const { name, relationType, colleagueRef } = filters;
        const user = item.user || item;

        if (name && !user.name.toLowerCase().includes(name.toLowerCase())) {
            return false;
        }

        if (relationType && user.relationType.toLowerCase() !== relationType.toLowerCase()) {
            return false;
        }

        if (relationType === 'colleague' && colleagueRef) {
            if (colleagueRef === 'eits' && !user.colleagueRef.toLowerCase().startsWith('eits')) {
                return false;
            }
            if (colleagueRef === 'atos' && !user.colleagueRef.toLowerCase().startsWith('a')) {
                return false;
            }
            if (colleagueRef === 'others' && (user.colleagueRef.toLowerCase().startsWith('eits') || user.colleagueRef.toLowerCase().startsWith('a'))) {
                return false;
            }
        }

        return true;
    });
};

const renderComment = async (reload = false, filters = {}) => {
    const cmtList = $('#cmt-list');
    if (reload) {
        cmtList.empty();
    }

    if (reload) {
        showLoader('#cmt-list');
    }

    $('#load-cmt').hide();
    const { comments } = await getComments(cmtList.children('.mcomment').length);
    $('#load-cmt').show();
    hideLoader('#cmt-list');

    if (comments.length === 0) {
        cmtList.html('<div>No comments found</div>');
        $('#load-cmt').hide();
    } else {
        const commentHtml = comments.map(cmt => {
            const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(cmt.user.name)}&background=random&color=fff&size=40&font-size=0.6`;
            const isOwner = cmt.user.id === getAccessToken();         
            return `
            <div class="mcomment">
                <div class="mcomment-header">
                    <img src="${avatarUrl}" alt="Avatar" class="mavatar">
                    <div class="mcomment-header-text">
                        <div class="muser-info">
                            <span class="musername">${cmt.user.name}</span>
                            <span class="mdate">${moment(cmt.updatedAt).fromNow()}</span>
                        </div>
                        <span class="mrelationType">${cmt.user.relationType}</span>
                    </div>
                    <div class="mcomment-actions">
                        <button class="edit-btn" style="background-color: #674ea7;" onclick="editComment('${cmt.id}', '${cmt.message}')">
                            <i class="fa-solid fa-pen-to-square"></i>
                        </button>
                        <button class="delete-btn" style="background-color: #f44336;" onclick="deleteComment('${cmt.id}')">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </div>
                </div>
                <div class="mcomment-body">
                    ${cmt.message}
                </div>
            </div>
            `;
        }).join('');

        cmtList.append(commentHtml);

        if (cmtList.children('.mcomment').length < window.totalComments) {
            $('#load-cmt').show();
        } else {
            $('#load-cmt').hide();
        }
    }
};

const reloadComments = (filters = {}) => {
    $('#cmt-list').empty();
    renderComment(true, filters);
};

const reloadAttendees = (filters = {}) => {
    renderAttendeesContent(true, filters);
};


const applyFilters = debounce(() => {
    const nameFilter = $('#nameFilter').val().toLowerCase();
    let relationTypeFilter = $('#dropdownFilter').val().toLowerCase(); 
    let colleagueTypeFilter = $('#colleagueType').val().toLowerCase();  
    
    if (relationTypeFilter && relationTypeFilter.endsWith("s")) {
        relationTypeFilter = relationTypeFilter.slice(0, -1);
    }

    const filters = {};
    if (nameFilter) {
        filters.name = nameFilter;
    }
    if (relationTypeFilter) {
        filters.relationType = relationTypeFilter;
    }
    if (relationTypeFilter === 'colleague' && colleagueTypeFilter) { 
        filters.colleagueRef = colleagueTypeFilter;
    }

    reloadComments(filters);
    reloadAttendees(filters);
    $('#filter-section').hide();
}, 300);

window.attendeesContent = `
 <h4 style="visibility: hidden;">Attendees</h4>
<ul class="attendeesList mcomments">
    <div class="no-records">No records found</div>
</ul>
`;

window.absenteesContent = `
 <h4 style="visibility: hidden;">Attendees</h4>
<ul class="nattendeesList mcomments">
    <div class="no-records">No records found</div>
</ul>
`;


const renderAttendeesContent = async (reload = false, filters = {}) => {
    $('#attendees-content').html(window.attendeesContent);
    $('#absentees-content').html(window.absenteesContent);

    if (cachedAttendees.length === 0 || reload) {
        showLoader('.attendeesList');
        showLoader('.nattendeesList');
    }

    await fetchAttendees();

    hideLoader('.attendeesList');
    hideLoader('.nattendeesList');

    console.log('Rendering attendees with filters:', filters); // Debugging line

    const filteredAttendees = filterData(cachedAttendees, filters);
    console.log('Filtered Attendees:', filteredAttendees); // Debugging line

    const attendeesAndNot = [
        {
            $e: $('.attendeesList'),
            list: filteredAttendees.filter(at => at.isAttend)
        },
        {
            $e: $('.nattendeesList'),
            list: filteredAttendees.filter(at => !at.isAttend)
        }
    ];

    attendeesAndNot.forEach(({ $e, list }) => {      
        if (list.length === 0) {
            $e.html('<div class="no-records">No records found</div>');
        } else { 
            $e.empty();
            const attendeesHtml = list.map(at => {
                const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(at.name)}&background=random&color=fff&size=40&font-size=0.6`;
                return `
                    <div class="mcomment">
                        <div class="mcomment-header">
                            <img src="${avatarUrl}" alt="Avatar" class="mavatar">
                            <div class="mcomment-header-text">
                                <div class="muser-info">
                                    <span class="musername">${at.name}</span>
                                    <span class="mrelationType">${at.relationType}</span>
                                </div>    
                                <div class="mattend-status">${at.isAttend ? 'Participating' : 'Going to Miss'}</div>                            
                            </div>
                        </div>                
                    </div>
                `;
            }).join('');           
            $e.append(attendeesHtml);
        }
    });
};

function editAttendee(attendeeId, name, relationType, colleagueRef) {
    const newName = prompt('Edit name:', name);
    const newRelationType = prompt('Edit relation type:', relationType);
    const newColleagueRef = prompt('Edit colleague reference:', colleagueRef);
    if (newName && newRelationType && newColleagueRef) {
       
        window.alert("asd");
        renderAttendeesContent(true);
    }
}

function deleteAttendee(attendeeId) {
    if (confirm('Are you sure you want to delete this attendee?')) {
        
        window.alert("ajith");
        renderAttendeesContent(true);
    }
}

function debounce(func, wait) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

document.getElementById("dropdownFilter").addEventListener("change", function() {
    var selectedValue = this.value;
    if (selectedValue.toLowerCase() === "colleagues") {
        document.getElementById("colleagueOptions").style.display = "block";
    } else {
        document.getElementById("colleagueOptions").style.display = "none";
    }
});

$(document).ready(async function () {
    showLoader('#cmt-list');
    showLoader('.attendeesList');
    showLoader('.nattendeesList');
    
    await renderComment();
    await renderAttendeesContent();

    hideLoader('#cmt-list');
    hideLoader('.attendeesList');
    hideLoader('.nattendeesList');

    $('#filterBtn').click(function() {
        const nameFilterVal = $('#nameFilter').val();
        const dropdownFilterVal = $('#dropdownFilter').val();
        if ($(this).text() === 'Filter') {
            if (nameFilterVal !== '' || dropdownFilterVal !== '') {
                applyFilters();
                $(this).text('Remove Filter');
                $('#filter-section').hide();
            }
        } else {
            resetFilterSection();
            reloadComments();
            reloadAttendees();
            $(this).text('Filter');
            $('#filter-section').show();
        }
    });
    
    $('#load-cmt').click(function(){
        const cmtList = $('#cmt-list');
        if (cmtList.children('.mcomment').length < window.totalComments) renderComment();
    });

    const { users } = await getScoreBoard();
    const tableBody = $('#userTable tbody');
    tableBody.empty();
    users.forEach((user, i) => {
        const row = `
            <tr>
                <td>${i + 1}</td>
                <td>${user.name}</td>
                <td>${user.score}</td>
                <td>${user.noOfTry}</td>
                <td>${user.relationType}</td>        
            </tr>
        `;
        tableBody.append(row);
    });
});

function resetFilterSection() {
    $('#nameFilter').val('');
    $('#dropdownFilter').val('');
    $('#colleagueType').val('');
    $('#colleagueOptions').hide();
    $('#filter-section').hide();
}

$(document).ready(function(){
   
    $('#cowoSection').click(function(e){
        e.preventDefault();
      
        var posX = e.pageX;
        var posY = e.pageY;
    
        $('#contentBlockAjith').css({
            'top': posY + 'px',
            'left': posX + 'px',
            'display': 'block'
        });
    });

    
    $('#ceweSection').click(function(e){
        e.preventDefault();        
        var posX = e.pageX;
        var posY = e.pageY;    
        $('#contentBlockAnu').css({
            'top': posY + 'px',
            'left': posX + 'px',
            'display': 'block'
        });
    });

    $('#contentBlockAjith .close-btn').click(function(){
        $('#contentBlockAjith').hide();
    });
    $('#contentBlockAnu .close-btn').click(function(){
        $('#contentBlockAnu').hide();
    });
});


$(document).on('click', '.edit-comment', function() {
    const commentId = $(this).data('id');
    const newMessage = prompt('Edit your comment:');
    if (newMessage) {
        editComment(newMessage, commentId);
    }
});

$(document).on('click', '.delete-comment', function() {
    const commentId = $(this).data('id');
    if (confirm('Are you sure you want to delete this comment?')) {
        deleteComment(commentId);
    }
});

$(document).on('click', '.edit-attendee', function() {
    const commentId = $(this).data('id');
    const newMessage = prompt('Edit your visiting:');
    if (newMessage) {
        editAttendee(newMessage, commentId);
    }
});

$(document).on('click', '.delete-attendee', function() {
    const attendeeId = $(this).data('id');
    if (confirm('Are you sure you want to delete this attendee?')) {
        deleteAttendee(attendeeId);
    }
});
