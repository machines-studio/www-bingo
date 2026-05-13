<?php
  $h ??= null;
  $l ??= 50;
  $s ??= 50;
?>

<section>
  <fieldset name='h'>
    <label>teinte</label>
    <input type='range' name='h' <?= r($h, "value='$h'") ?> min='0' max='360' step='1'>
  </fieldset>

  <fieldset name='l'>
    <label>clarté</label>
    <input type='range' name='l' <?= r($l, "value='$l'") ?> min='0' max='100' step='1'>
  </fieldset>

  <fieldset name='s'>
    <label>saturation</label>
    <input type='range' name='s' <?= r($s, "value='$s'") ?> min='0' max='100' step='1'>
  </fieldset>
</section>
