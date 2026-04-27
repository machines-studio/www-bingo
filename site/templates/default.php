<?php
  if (!isset($_SERVER['HTTP_X_BARBA'])) {
    snippet('html/header');
    snippet('components/Menu');
  }
?>

<main
  data-barba='container'
  data-barba-namespace='<?= $view = $page->intendedTemplate()->name() ?>'
  data-title='<?= snippet('html/title', [], true) ?>'
>
  <?php snippet(["views/$view", 'views/default']) ?>

  <style>
    :root { --color-page: <?= $page->color()->toHex()->or('initial') ?>; }
  </style>
</main>

<?php
  if (!isset($_SERVER['HTTP_X_BARBA'])) {
    snippet('components/Contact');
    snippet('components/Footer');
    snippet('html/footer');
  }
?>
