# Shower Remote

Shower Remote - "Keynote Remote" for Shower presentation template

## Install

`npm install shower-remote -g`

## Use

  - Add `<script src="/shower/remote.js"></script>` to your presentation to enable Shower Remote
  - Run `$ shower-remote your_secret` in your presentation dir. You can omit `your_secret`.
  - Then use that urls:
    - Slave  `http://localhost:3000/`
    - Master `http://localhost:3000/?your_secret` to control your presentation

## What if I run shower-remote?

```bash
$ shower-remote s
Running shower-remote s 3000 0.0.0.0
Add <script src="/shower/remote.js"></script> to your presentation to enable Shower Remote
Then use that urls:
  - Slave  http://localhost:3000/.../
  - Master http://localhost:3000/.../?s
If localhost does not work - try these addresses bbbb::eeee:aaaa:ffff:eeee, 192.168.0.1

   info  - socket.io started
```

