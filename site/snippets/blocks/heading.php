<?php
  if ($block->text()->isEmpty()) return;
  $id = $block->text()->slug();
  $level = $block->level()->or('h3');
?>

<header data-level='<?= $level ?>'>
  <<?= $level ?> id='<?= $id ?>'>
    <?= $block->text()->kirbytext() ?>
  </<?= $level ?>>

  <?php if ($level == 'h3') : ?>
    <nav><a href='#<?= $id ?>'>↓</a></nav>
  <?php endif ?>
</header>
