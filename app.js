/* ==========================================================================
   SPRINGGUIDE INTERACTIVE ENGINE (app.js)
   Tactile micro-interactions, tab routing, live search, code copy, and simulator
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initReadingProgress();
    initDevLoopSimulator();
    initCurriculumTabs();
    initOptimizationLab();
    initInterviewVault();
    initCodeCopyButtons();
    initMobileNav();
});

/* --------------------------------------------------------------------------
   1. Reading Progress Bar
   -------------------------------------------------------------------------- */
function initReadingProgress() {
    const progressBar = document.querySelector('.scroll-progress-bar');
    if (!progressBar) return;

    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        progressBar.style.width = `${Math.min(100, Math.max(0, scrollPercent))}%`;
    }, { passive: true });
}

/* --------------------------------------------------------------------------
   2. Developer Loop Simulator (Hero Interactive Feature)
   -------------------------------------------------------------------------- */
const devLoopData = [
    {
        step: "01",
        label: "BUILD",
        desc: "Implement Feature",
        cmd: "mvn compile -Dfeature=job-application-api",
        log: "[INFO] Building JobApplicationController & Service layer...\n[INFO] Compiling 14 source files to target/classes\n[SUCCESS] Feature build complete (0.84s)"
    },
    {
        step: "02",
        label: "TEST",
        desc: "Verify Logic",
        cmd: "mvn test -Dtest=JobApplicationServiceTest",
        log: "[RUNNING] @WebMvcTest & Mockito service unit tests...\n[PASSED] testCreateApplication_ValidRequest()\n[PASSED] testDuplicateApplication_ThrowsConflict()\n[INFO] Tests run: 8, Failures: 0, Errors: 0 (1.12s)"
    },
    {
        step: "03",
        label: "BREAK",
        desc: "Stress Test & Edge Cases",
        cmd: "k6 run stress-test-10k-concurrency.js",
        log: "[WARNING] Concurrency spikes to 10,000 req/s\n[ALERT] Database connection pool exhausted (HikariPool-1: max=10)\n[ALERT] HTTP 500: LockAcquisitionException: Deadlock detected\n[ALERT] Latency p99 degraded to 4,200ms"
    },
    {
        step: "04",
        label: "DEBUG",
        desc: "Identify Bottlenecks",
        cmd: "cat application-profile.log | grep -E 'SLOW_QUERY|N+1'",
        log: "[TRACE] Hibernate: SELECT * FROM applications WHERE user_id = ?\n[TRACE] Hibernate (x100 queries): SELECT * FROM jobs WHERE id = ?\n[TRACE] Bottleneck identified: N+1 query issue + missing composite index on (user_id, job_id)"
    },
    {
        step: "05",
        label: "MEASURE",
        desc: "Analyze Latency & CPU",
        cmd: "curl -s http://localhost:8080/actuator/metrics/http.server.requests",
        log: "[METRICS] Total Requests: 142,500 | Error Rate: 8.4%\n[METRICS] Latency Avg: 680ms | p95: 2,400ms | p99: 4,200ms\n[METRICS] DB Queries per Request: 101 queries (Severe bottleneck)"
    },
    {
        step: "06",
        label: "OPTIMIZE",
        desc: "Refine & Scale",
        cmd: "git diff UserService.java --stat && mvn test",
        log: "[OPTIMIZE] Swapped lazy fetch with @EntityGraph / JOIN FETCH\n[OPTIMIZE] Added Redis cache for hot company profiles (TTL 10m)\n[RESULT] p99 Latency: 4,200ms -> 18ms (99.5% reduction!)\n[RESULT] DB Queries per Request: 101 -> 1 query"
    },
    {
        step: "07",
        label: "DOCUMENT",
        desc: "Lock Architecture",
        cmd: "curl -s http://localhost:8080/v3/api-docs | jq .info",
        log: "[DOCS] OpenAPI 3.0 specs updated with RFC 7807 error schema\n[DOCS] Production runbook: Added HikariCP sizing guidelines\n[VERIFIED] Ready for production deployment."
    }
];

function initDevLoopSimulator() {
    const loopRows = document.querySelectorAll('.loop-step-row');
    const cmdLine = document.querySelector('.terminal-cmd-line .cmd-text');
    const logOutput = document.querySelector('.terminal-log-output');

    if (!loopRows.length || !cmdLine || !logOutput) return;

    let currentIndex = 0;
    let autoInterval = null;

    function setLoopStep(index) {
        loopRows.forEach((r, i) => {
            r.classList.toggle('active', i === index);
        });
        const data = devLoopData[index];
        cmdLine.textContent = data.cmd;
        logOutput.textContent = data.log;
        currentIndex = index;
    }

    loopRows.forEach((row, idx) => {
        row.addEventListener('click', () => {
            clearInterval(autoInterval);
            setLoopStep(idx);
        });
    });

    // Start auto loop ticker every 4.5 seconds
    autoInterval = setInterval(() => {
        const nextIndex = (currentIndex + 1) % devLoopData.length;
        setLoopStep(nextIndex);
    }, 4500);
}

/* --------------------------------------------------------------------------
   3. Curriculum Tracks Tab Switcher
   -------------------------------------------------------------------------- */
function initCurriculumTabs() {
    const tabs = document.querySelectorAll('.curriculum-tabs .tab-btn');
    const tracks = document.querySelectorAll('.track-container');

    if (!tabs.length || !tracks.length) return;

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetTrack = tab.getAttribute('data-track');

            tabs.forEach(t => t.classList.remove('active'));
            tracks.forEach(tr => tr.classList.remove('active'));

            tab.classList.add('active');
            const activeTrack = document.getElementById(targetTrack);
            if (activeTrack) {
                activeTrack.classList.add('active');
            }
        });
    });
}

/* --------------------------------------------------------------------------
   4. Optimization Lab Switcher
   -------------------------------------------------------------------------- */
function initOptimizationLab() {
    const navItems = document.querySelectorAll('.lab-nav-item');
    const panes = document.querySelectorAll('.challenge-pane');

    if (!navItems.length || !panes.length) return;

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const targetId = item.getAttribute('data-challenge');

            navItems.forEach(n => n.classList.remove('active'));
            panes.forEach(p => p.classList.remove('active'));

            item.classList.add('active');
            const targetPane = document.getElementById(targetId);
            if (targetPane) {
                targetPane.classList.add('active');
            }
        });
    });
}

/* --------------------------------------------------------------------------
   5. Interview Question Vault (Search, Filter, Accordion)
   -------------------------------------------------------------------------- */
function initInterviewVault() {
    const filterChips = document.querySelectorAll('.filter-chip');
    const searchInput = document.getElementById('vault-search');
    const qaCards = document.querySelectorAll('.qa-card');

    if (!qaCards.length) return;

    // Accordion Toggle
    qaCards.forEach(card => {
        const header = card.querySelector('.qa-question-header');
        if (header) {
            header.addEventListener('click', () => {
                const isOpen = card.classList.contains('open');
                // Optional: close siblings or allow multiple open
                card.classList.toggle('open', !isOpen);
            });
        }
    });

    // Filter Logic
    let currentCategory = 'all';
    let currentSearchTerm = '';

    function applyFilters() {
        qaCards.forEach(card => {
            const cardCat = card.getAttribute('data-category');
            const questionText = (card.querySelector('.qa-question')?.textContent || '').toLowerCase();
            const answerText = (card.querySelector('.qa-answer-text')?.textContent || '').toLowerCase();

            const matchesCategory = (currentCategory === 'all' || cardCat === currentCategory);
            const matchesSearch = !currentSearchTerm || 
                                  questionText.includes(currentSearchTerm) || 
                                  answerText.includes(currentSearchTerm);

            if (matchesCategory && matchesSearch) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }

    filterChips.forEach(chip => {
        chip.addEventListener('click', () => {
            filterChips.forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            currentCategory = chip.getAttribute('data-cat');
            applyFilters();
        });
    });

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            currentSearchTerm = e.target.value.trim().toLowerCase();
            applyFilters();
        });
    }
}

/* --------------------------------------------------------------------------
   6. One-Click Code Copy with Toast Feedback
   -------------------------------------------------------------------------- */
function initCodeCopyButtons() {
    const copyBtns = document.querySelectorAll('.copy-btn');
    const toast = document.getElementById('toast-notification');

    function showToast(message) {
        if (!toast) return;
        toast.textContent = message;
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 2200);
    }

    copyBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const codeBox = btn.closest('.code-block, .diff-col');
            const codeEl = codeBox?.querySelector('.code-content, .diff-code-box');
            if (codeEl) {
                const text = codeEl.innerText || codeEl.textContent;
                navigator.clipboard.writeText(text).then(() => {
                    const originalHTML = btn.innerHTML;
                    btn.innerHTML = '✓ Copied';
                    showToast('Snippet copied to clipboard!');
                    setTimeout(() => {
                        btn.innerHTML = originalHTML;
                    }, 2000);
                }).catch(() => {
                    showToast('Failed to copy');
                });
            }
        });
    });
}

/* --------------------------------------------------------------------------
   7. Mobile Navigation Toggle
   -------------------------------------------------------------------------- */
function initMobileNav() {
    const toggleBtn = document.querySelector('.mobile-nav-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (!toggleBtn || !navLinks) return;

    toggleBtn.addEventListener('click', () => {
        const isVisible = navLinks.style.display === 'flex';
        navLinks.style.display = isVisible ? 'none' : 'flex';
        if (!isVisible) {
            navLinks.style.flexDirection = 'column';
            navLinks.style.position = 'absolute';
            navLinks.style.top = '100%';
            navLinks.style.left = '0';
            navLinks.style.width = '100%';
            navLinks.style.background = '#090b10';
            navLinks.style.padding = '1.5rem';
            navLinks.style.borderBottom = '1px solid var(--border-medium)';
        }
    });
}
