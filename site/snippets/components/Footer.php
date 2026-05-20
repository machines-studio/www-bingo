<?php
  $links = [
    page('mentions-legales'),
    page('sitemap')
  ];
?>

<footer class='footer'>
  <div class='footer__text'>
    <?= $site->footer()->kirbytext() ?>
  </div>

  <ul class='footer__links'>
    <?php foreach ($links as $link) : ?>
      <li class='footer__link'>
        <?php snippet('html/link', $link) ?>
      </li>
    <?php endforeach ?>
  </ul>
</footer>
