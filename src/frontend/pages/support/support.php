<?php
require_once __DIR__ . '/../../../backend/models/Support.php';

$ticketError = '';

$tab = $_GET['tab'] ?? '';
$q   = trim($_GET['q'] ?? '');
if ($q && $tab === '') $tab = 'faq';

// Load data per tab
$currentArticle   = null; //dipakai untuk detail artikel
$categoryArticles = []; //dipakai untuk daftar artikel per kategori
$popularArticles  = []; //dipakai untuk halaman utama support (help-home.php)

if ($tab === 'article') { //unntuk mengambil ID artikel dari URL
    $artId = (int)($_GET['id'] ?? 0);
    try {
        $currentArticle = $artId ? getArticleById($artId) : null;
        if ($currentArticle) incrementArticleViews($artId);
    } catch (Exception $e) { //kalo terjadi error saat ambil artikel, set ke null aja biar gak crash
        $currentArticle = null; 
    }

} elseif ($tab === 'articles') { // kode ini untuk ambil kategori dari URL dan load artikel berdasarkan kategori tersebut   
    $artCat = $_GET['cat'] ?? '';
    try {
        $categoryArticles = $artCat ? getArticlesByCategory($artCat) : [];
    } catch (Exception $e) { 
        $categoryArticles = []; 
    }

} elseif ($tab === '') {
    try {
        $popularArticles = getPopularArticles(5);
    } catch (Exception $e) { 
        $popularArticles = []; 
    }
}

// Tab active state: article/articles highlight Help Center tab
$activeTab = in_array($tab, ['article', 'articles']) ? '' : $tab;
?>

<!-- PAGE HEADER -->
<div class="supp-header">
    <div>
        <h1 class="supp-title">Help &amp; Support</h1>
        <p class="supp-subtitle">How can we help you today?</p>
    </div>
    <?php if (isLoggedIn()): ?>
    <a href="/?page=support&tab=contact" class="btn btn-primary btn-sm">Open a Ticket</a>
    <?php endif; ?>
</div>

<!-- SEARCH BAR -->
<div class="supp-search-wrap">
    <form method="GET" action="/" class="supp-search-form">
        <input type="hidden" name="page" value="support">
        <input type="hidden" name="tab"  value="faq">
        <div class="supp-search-inner">
            <input type="text" name="q" class="supp-search-input"
                   placeholder="Search help topics, FAQs, guides..."
                   value="<?= htmlspecialchars($q) ?>" autocomplete="off">
            <button type="submit" class="btn btn-primary btn-sm" style="flex-shrink:0">Search</button>
        </div>
    </form>
</div>

<!-- TABS -->
<nav class="supp-tabs">
    <a href="/?page=support"              class="supp-tab <?= $activeTab === ''        ? 'active' : '' ?>">Help Center</a>
    <a href="/?page=support&tab=faq"      class="supp-tab <?= $activeTab === 'faq'     ? 'active' : '' ?>">FAQ</a>
    <a href="/?page=support&tab=contact"  class="supp-tab <?= $activeTab === 'contact' ? 'active' : '' ?>">Contact Us</a>
    <a href="/?page=support&tab=refund"   class="supp-tab <?= $activeTab === 'refund'  ? 'active' : '' ?>">Refund Policy</a>
</nav>

<!-- CONTENT -->
<?php if ($tab === 'faq'): ?>
    <?php include __DIR__ . '/faq.php'; ?>
<?php elseif ($tab === 'contact'): ?>
    <?php include __DIR__ . '/contact.php'; ?>
<?php elseif ($tab === 'refund'): ?>
    <?php include __DIR__ . '/refund.php'; ?>
<?php elseif ($tab === 'article'): ?>
    <?php include __DIR__ . '/article.php'; ?>
<?php elseif ($tab === 'articles'): ?>
    <?php include __DIR__ . '/articles.php'; ?>
<?php else: ?>
    <?php include __DIR__ . '/help-home.php'; ?>
<?php endif; ?>