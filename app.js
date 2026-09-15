/* ==========================================================================
   SPRINGGUIDE INTERACTIVE ENGINE (app.js)
   Apple-grade smooth transitions, search filtering, and methodology explorer
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initReadingProgress();
    initManifestoMethodology();
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
   2. Apple-Style Engineering Methodology Explorer
   -------------------------------------------------------------------------- */
const methodologyData = [
    {
        step: "01",
        name: "BUILD",
        tagline: "Implement Clean Feature",
        detailTitle: "Phase 1: Domain & API Implementation",
        detailDesc: "Construct the feature with strict DTO boundaries, immutable Java records, and explicit constructor injection. Never expose raw database entities to external consumers."
    },
    {
        step: "02",
        name: "TEST",
        tagline: "Automate Slice Verification",
        detailTitle: "Phase 2: Automated Testing Suite",
        detailDesc: "Verify logic across the test pyramid: fast Mockito unit tests, isolated slice tests with @WebMvcTest and @DataJpaTest, and real container validation via Testcontainers."
    },
    {
        step: "03",
        name: "BREAK",
        tagline: "Stress & Edge Case Audit",
        detailTitle: "Phase 3: Deliberate Failure Analysis",
        detailDesc: "Expose weaknesses before production does: simulate high-concurrency traffic, test deadlocks, verify transaction rollback boundaries, and audit memory limits."
    },
    {
        step: "04",
        name: "DEBUG",
        tagline: "Isolate True Bottlenecks",
        detailTitle: "Phase 4: Root Cause Identification",
        detailDesc: "Inspect Hibernate SQL generation, trace request execution through MDC correlation IDs, and evaluate database query execution plans with EXPLAIN."
    },
    {
        step: "05",
        name: "MEASURE",
        tagline: "Empirical Performance Metrics",
        detailTitle: "Phase 5: Measure Instead of Guessing",
        detailDesc: "Observe real data: track p95 and p99 latency histograms, monitor HikariCP connection pool usage, analyze GC pause frequencies, and count queries per endpoint."
    },
    {
        step: "06",
        name: "OPTIMIZE",
        tagline: "Scale & Refine",
        detailTitle: "Phase 6: Targeted Optimization",
        detailDesc: "Eliminate N+1 queries using JOIN FETCH and EntityGraphs, add Redis Cache-Aside with explicit TTLs, create composite B-tree indexes, and offload tasks asynchronously."
    },
    {
        step: "07",
        name: "DEFEND",
        tagline: "Articulate Trade-Offs",
        detailTitle: "Phase 7: Production Readiness & Interview Defense",
        detailDesc: "Document architecture cleanly with OpenAPI 3.0 contracts and articulate your technical decisions and trade-offs with senior-level confidence."
    }
];

function initManifestoMethodology() {
    const stepItems = document.querySelectorAll('.manifesto-step-item');
    const detailTitle = document.querySelector('.detail-pane-title');
    const detailDesc = document.querySelector('.detail-pane-desc');

    if (!stepItems.length || !detailTitle || !detailDesc) return;

    let currentIndex = 0;
    let autoInterval = null;

    function setStep(index) {
        stepItems.forEach((item, i) => {
            item.classList.toggle('active', i === index);
        });
        const data = methodologyData[index];
        detailTitle.textContent = data.detailTitle;
        detailDesc.textContent = data.detailDesc;
        currentIndex = index;
    }

    stepItems.forEach((item, idx) => {
        item.addEventListener('click', () => {
            clearInterval(autoInterval);
            setStep(idx);
        });
    });

    // Auto-advance calmly every 5 seconds
    autoInterval = setInterval(() => {
        const nextIndex = (currentIndex + 1) % methodologyData.length;
        setStep(nextIndex);
    }, 5000);
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
        }, 2000);
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
                    showToast('Snippet copied to clipboard');
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

    toggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        navLinks.classList.toggle('mobile-open');
    });

    // Close when clicking any nav link
    navLinks.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('mobile-open');
        });
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
        if (!navLinks.contains(e.target) && !toggleBtn.contains(e.target)) {
            navLinks.classList.remove('mobile-open');
        }
    });
}

