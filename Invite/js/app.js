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


// Function to open the popup and populate it with content
function openPopup(title, brideDishes, groomDishes) {
    // Set the header title
    var popupHeader = document.querySelector('.popup-header');
    popupHeader.textContent = title;

    // Add a paragraph element with the text "List of menus" below the title
    var listParagraph = document.createElement('p');
    listParagraph.textContent = "List of menus";
    listParagraph.style.fontSize = "18px";
    listParagraph.style.textAlign = "center";
    listParagraph.style.marginTop = "5px";

    popupHeader.appendChild(listParagraph);

    // Construct HTML content with lists of food items
    var brideContent = '<div class="food-item"><strong>Groom Mandapam</strong></div><div><ul>';
    for (var i = 0; i < brideDishes.length; i++) {
        brideContent += '<li>' + brideDishes[i] + '</li>';
    }
    brideContent += '</ul></div>';

    var groomContent = '<div class="food-item"><strong>Bride Mandapam</strong></div><div><ul>';
    for (var j = 0; j < groomDishes.length; j++) {
        groomContent += '<li>' + groomDishes[j] + '</li>';
    }
    groomContent += '</ul></div>';

    // Populate bride and groom content in respective columns
    document.getElementById("brideDishes").innerHTML = brideContent;
    document.getElementById("groomDishes").innerHTML = groomContent;

    // Display the popup
    var popup = document.getElementById("popup");
    popup.style.display = "block";
    setVerticalLineHeight();

    // Add event listener to close popup when clicking outside
    window.addEventListener('click', function (event) {
        if (event.target == popup) {
            closePopup();
        }
    });
}


// Function to close the popup
function closePopup() {
    var popup = document.getElementById("popup");
    popup.style.display = "none";
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

// const apiUrl = "https://ajith-marriage-api.azurewebsites.net/api/v1";
const apiUrl = "http://localhost:8080/api/v1";

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
    if (resp.ok && typeof callBack === 'function') {
        callBack();
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
    queryParams.append("limit", 100);
    queryParams.append("offset", offset);
    const resp = await fetch(`${apiUrl}/comments?${queryParams.toString()}`, {
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
    if (resp.ok) {
        alert('Done');
    } else {
        alert(await resp.text());
    }
}

/**
 * 
 * @param {string} message 
 * @param {string} commentId 
 */
async function editComment(message, commentId) {
    const resp = await fetch(`${apiUrl}/comments/${commentId}`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify({
            message
        })
    })
    if (resp.ok) {
        alert('Done');
    } else {
        alert(await resp.text());
    }
}

/**
 * 
 * @param {string} commentId 
 */
async function deleteComment(commentId) {
    const resp = await fetch(`${apiUrl}/comments/${commentId}`, {
        method: "DELETE",
        headers: getHeaders()
    })
    if (resp.ok) {
        alert('Done');
    } else {
        alert(await resp.text());
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

function resetFormInput() {
    $('#phoneNumber').val('');
    $('#otp').val('');
    $('#relationType').val('').change();
    $('#uname').val('');
    $('#colleagueRef').val('');
    $('#comments').val('');
    $('#isAttend').prop('checked'), false;
}

$(document).ready(async function () {
    const renderComment = async () => {
        const cmtList = $('#cmt-list');
        const commentResponse = await getComments(cmtList.children().length);
        commentResponse.comments.forEach(cmt => {
            const li = `
                <li>
                    <div>${cmt.user.name}:</div>
                    <div>${cmt.message}</div>
                </li>
            `;
            cmtList.append(li);
        });
    }
    const reloadComments = () => {
        $('#cmt-list').empty()
        renderComment();
    }
    renderComment();
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

    $('#submitCmnds').click(async () => {
        const mobileNumber = $('#phoneNumber').val().trim();
        const otp = $('#otp').val().trim();
        const relationType = $('#relationType').val().trim();
        const name = $('#uname').val().trim();
        const colleagueRef = $('#colleagueRef').val().trim();
        const message = $('#comments').val().trim();
        const isAttend = $('#isAttend').prop('checked');
        const hasAccessToken = !!getAccessToken();
        const error = []

        if (!message) {
            error.push('Message is required');
        }

        if (!hasAccessToken) {
            if (!mobileNumber || !otp) {
                location.reload();
                return;
            }

            if (!name) {
                error.push('Name is required');
            }

            if (!relationType) {
                error.push('Choose Relation Type');
            }

            if (relationType === 'COLLEAGUE' && !colleagueRef) {
                error.push('Emp Ref is required');
            }

            if (error.length > 0) {
                alert(error.join(', '));
                return;
            }

            await initialize(mobileNumber, otp, name, isAttend, relationType, colleagueRef, message);
            $('#phoneModal').modal('toggle');
            resetFormInput();
            reloadComments();
            location.reload();
        } else {
            if (error.length > 0) {
                alert(error.join(', '));
                return;
            }
            await addComment(message);
            $('#phoneModal').modal('toggle');
            resetFormInput();
            reloadComments();
        }
    })
    const { users: atList } = await getAttendees();
    const attendees = atList.filter(at => at.isAttend);
    const nattendees = atList.filter(at => !at.isAttend);
    const attendeesList = $('.attendeesList');
   if (attendees.length > 0) attendeesList.empty();
    attendees.forEach(at => {
        const li = `
            <li>
                <div>${at.name}: ${at.relationType}</div>
            </li>
        `;
        attendeesList.append(li);
    });
    const nattendeesList = $('.nattendeesList');
    if (nattendees.length > 0) nattendeesList.empty();
    nattendees.filter(at => !at.isAttend).forEach(at => {
        const li = `
            <li>
                <div>${at.name}: ${at.relationType}</div>
            </li>
        `;
        nattendeesList.append(li);
    });
})