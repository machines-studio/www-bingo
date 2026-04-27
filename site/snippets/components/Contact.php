<?php
  $contact = $site->contact()->toObject();
  if ($site->contact()->isEmpty()) return;
?>

<section class='contact'>
  <h3><?= t('contact') ?></h3>
  <div class='contact__columns'>
    <div class='prose'><?= $contact->left()->kirbytext() ?></div>
    <div class='prose'><?= $contact->right()->kirbytext() ?></div>
  </div>
</section>
