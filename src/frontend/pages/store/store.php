<?php
$filter = $_GET['filter'] ?? '';
$genre  = $_GET['genre']  ?? '';
?>

<?php if ($genre): ?>

<h1 class="page-title"><?= htmlspecialchars($genre) ?></h1>
<?php $genreGames = getGamesByGenre($genre); ?>
<?php if (empty($genreGames)): ?>
<div class="card" style="padding:48px;text-align:center">
    <p class="text-secondary">No games found in this genre.</p>
</div>
<?php else: ?>
<div class="grid-4">
    <?php foreach ($genreGames as $game):
        $discounted = $game['discount'] > 0 ? $game['price'] * (1 - $game['discount'] / 100) : null;
    ?>
    <div class="card game-card">
        <div class="game-card-img">
            <?php if (!empty($game['image'])): ?>
                <img src="/uploads/games/<?= htmlspecialchars($game['image']) ?>" alt="<?= htmlspecialchars($game['title']) ?>" style="width:100%;height:100%;object-fit:cover">
            <?php else: ?>  
                <span class="text-secondary" style="font-size:12px">No Image</span>
            <?php endif; ?>
        </div>
        <div class="game-card-body">
            <a href="/?page=game&id=<?= $game['id'] ?>" style="text-decoration:none">
                <p class="game-card-title"><?= htmlspecialchars($game['title']) ?></p>
            </a>
            <p class="game-card-genre"><?= htmlspecialchars($game['genre']) ?></p>
            <div class="game-card-price">
                <div>
                    <?php if ($game['is_free']): ?>
                        <span class="price-discount" style="background:rgba(74,138,90,0.15);color:var(--accent-green);border-color:rgba(74,138,90,0.3)">FREE</span>
                    <?php elseif ($discounted): ?>
                        <span class="price-discount">-<?= $game['discount'] ?>%</span>
                    <?php endif; ?>
                </div>
                <div>
                    <?php if ($game['is_free']): ?>
                        <span class="price-free">Free</span>
                    <?php elseif ($discounted): ?>
                        <span class="price-tag">Rp <?= number_format($discounted, 0, ',', '.') ?></span>
                    <?php else: ?>
                        <span class="price-tag">Rp <?= number_format($game['price'], 0, ',', '.') ?></span>
                    <?php endif; ?>
                </div>
            </div>
            <div class="mt-8">
                <?php if (isLoggedIn()): ?>
                    <?php if (isInCart(getCurrentUser()['id'], $game['id'])): ?>
                        <a href="/?page=cart" class="btn btn-outline btn-sm btn-block">In Cart</a>
                    <?php elseif ($game['is_free']): ?>
                        <a href="/?action=add_to_cart&game_id=<?= $game['id'] ?>" class="btn btn-green btn-sm btn-block">Get Free</a>
                    <?php else: ?>
                        <a href="/?action=add_to_cart&game_id=<?= $game['id'] ?>" class="btn btn-green btn-sm btn-block">Add to Cart</a>
                    <?php endif; ?>
                <?php else: ?>
                    <a href="/?page=login" class="btn btn-outline btn-sm btn-block">Login to Buy</a>
                <?php endif; ?>
            </div>
        </div>
    </div>
    <?php endforeach; ?>
</div>
<?php endif; ?>

<?php elseif (!$filter): ?>

<!-- ============================================================
     HERO — Slideshow banner
     ============================================================ -->
<?php
$heroGames = array_slice(getFeaturedGames(), 0, 3);

$genreAccents = [
    'Action'      => ['bg' => 'rgba(160,40,25,0.90)',  'glow' => 'rgba(220,70,40,0.55)',   'border' => 'rgba(220,80,60,0.70)'],
    'RPG'         => ['bg' => 'rgba(70,25,140,0.90)',  'glow' => 'rgba(130,70,230,0.55)',  'border' => 'rgba(150,90,240,0.70)'],
    'Strategy'    => ['bg' => 'rgba(15,90,75,0.90)',   'glow' => 'rgba(40,180,140,0.55)',  'border' => 'rgba(50,200,155,0.65)'],
    'Simulation'  => ['bg' => 'rgba(15,90,30,0.90)',   'glow' => 'rgba(55,180,80,0.55)',   'border' => 'rgba(65,200,90,0.65)'],
    'Indie'       => ['bg' => 'rgba(130,80,10,0.90)',  'glow' => 'rgba(220,155,30,0.55)',  'border' => 'rgba(240,175,45,0.70)'],
    'Multiplayer' => ['bg' => 'rgba(15,60,140,0.90)',  'glow' => 'rgba(45,120,220,0.55)',  'border' => 'rgba(65,145,240,0.70)'],
];
$defaultAccent = ['bg' => 'rgba(184,50,50,0.90)', 'glow' => 'rgba(220,70,50,0.55)', 'border' => 'rgba(220,80,60,0.70)'];
?>
<div class="hero" id="heroSection">

    <div class="hero-grid"></div>
    <div class="hero-fade"></div>

    <div class="hero-slides">
        <?php foreach ($heroGames as $i => $hg):
            $hgPrice = $hg['discount'] > 0 ? $hg['price'] * (1 - $hg['discount'] / 100) : $hg['price'];
            $accent  = $genreAccents[$hg['genre']] ?? $defaultAccent;
            $eyebrow = $i === 0 ? 'Featured Game' : ($hg['discount'] > 0 ? 'Special Offer — -' . $hg['discount'] . '% OFF' : 'Recommended');
        ?>
        <div class="hero-slide <?= $i === 0 ? 'active' : '' ?>" data-index="<?= $i ?>">

            <!-- Full background: game image or colour fallback -->
            <?php if (!empty($hg['image'])): ?>
                <div class="hero-slide-bg" style="background-image: url('/uploads/games/<?= htmlspecialchars($hg['image']) ?>'); background-size: cover; background-position: center;"></div>
            <?php else: ?>
                <div class="hero-slide-bg" style="background: radial-gradient(ellipse 90% 120% at 75% 50%, <?= $accent['glow'] ?> 0%, transparent 60%), linear-gradient(100deg, #0e0e11 0%, <?= $accent['bg'] ?> 45%, #0e0e11 100%);"></div>
            <?php endif; ?>

            <!-- Dark overlay: heavy on left for readability, fades to transparent on right -->
            <div class="hero-slide-overlay"></div>

            <!-- Content left -->
            <div class="hero-content">
                <div class="hero-eyebrow"><?= $eyebrow ?></div>
                <h1 class="hero-title"><?= htmlspecialchars($hg['title']) ?></h1>
                <p class="hero-desc">
                    <?= htmlspecialchars(mb_substr($hg['description'] ?? 'Discover this amazing game on UAP.', 0, 130)) ?><?= mb_strlen($hg['description'] ?? '') > 130 ? '...' : '' ?>
                </p>
                <div class="hero-meta">
                    <span class="hero-genre-tag"><?= htmlspecialchars($hg['genre']) ?></span>
                    <?php if ($hg['discount'] > 0): ?>
                    <span class="hero-discount-tag">-<?= $hg['discount'] ?>% OFF</span>
                    <?php endif; ?>
                </div>
                <div class="hero-actions">
                    <?php if ($hg['is_free']): ?>
                        <a href="/?page=game&id=<?= $hg['id'] ?>" class="btn btn-hero-cta btn-lg">Play Free</a>
                        <span class="hero-price" style="color:var(--accent-green);font-weight:700">FREE TO PLAY</span>
                    <?php else: ?>
                        <a href="/?page=game&id=<?= $hg['id'] ?>" class="btn btn-hero-cta btn-lg">View Game</a>
                        <div class="hero-price-block">
                            <?php if ($hg['discount'] > 0): ?>
                            <span class="hero-price-was">Rp <?= number_format($hg['price'], 0, ',', '.') ?></span>
                            <?php endif; ?>
                            <span class="hero-price">Rp <?= number_format($hgPrice, 0, ',', '.') ?></span>
                        </div>
                    <?php endif; ?>
                </div>
            </div>

        </div>
        <?php endforeach; ?>
    </div>

    <!-- Dot navigation -->
    <?php if (count($heroGames) > 1): ?>
    <div class="hero-nav">
        <?php foreach ($heroGames as $i => $hg): ?>
        <div class="hero-dot <?= $i === 0 ? 'active' : '' ?>" onclick="goSlide(<?= $i ?>)"></div>
        <?php endforeach; ?>
    </div>
    <?php endif; ?>

</div>


<!-- ============================================================
     FEATURED GAMES
     ============================================================ -->
<div class="store-section" style="margin-top:32px">
    <div class="section-header">
        <h2 class="section-title">Featured & Recommended</h2>
    </div>
    <?php include __DIR__ . '/featured.php'; ?>
</div>

<!-- ============================================================
     NEW RELEASES
     ============================================================ -->
<div class="store-section">
    <div class="section-header">
        <h2 class="section-title">New Releases</h2>
        <a href="/?page=store&filter=new">See All</a>
    </div>
    <?php include __DIR__ . '/new-releases.php'; ?>
</div>

<!-- ============================================================
     ON SALE
     ============================================================ -->
<div class="store-section">
    <div class="section-header">
        <h2 class="section-title">Weekend Specials</h2>
        <a href="/?page=store&filter=sale">View All Deals</a>
    </div>
    <?php include __DIR__ . '/on-sale.php'; ?>
</div>

<!-- ============================================================
     STATS BAR
     ============================================================ -->
<div class="stats-bar">
    <div class="stat-item">
        <div class="stat-val"><?= number_format(count(getFeaturedGames()) + count(getFreeGames()) + count(getOnSaleGames())) ?>+</div>
        <div class="stat-label">Games Available</div>
    </div>
    <div class="stat-item">
        <div class="stat-val">Free</div>
        <div class="stat-label">To Register</div>
    </div>
    <div class="stat-item">
        <div class="stat-val"><?= count(getOnSaleGames()) ?></div>
        <div class="stat-label">Active Deals</div>
    </div>
    <div class="stat-item">
        <div class="stat-val"><?= count(getFreeGames()) ?></div>
        <div class="stat-label">Free to Play</div>
    </div>
</div>

<?php elseif ($filter === 'new'): ?>

<h1 class="page-title">New Releases</h1>
<?php include __DIR__ . '/new-releases.php'; ?>

<?php elseif ($filter === 'sale'): ?>

<h1 class="page-title">On Sale</h1>
<?php include __DIR__ . '/on-sale.php'; ?>

<?php elseif ($filter === 'free'): ?>

<h1 class="page-title">Free to Play</h1>
<?php include __DIR__ . '/free-to-play.php'; ?>

<?php endif; ?>
