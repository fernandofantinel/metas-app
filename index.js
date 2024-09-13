const { select, input, checkbox, } = require('@inquirer/prompts')

let meta = {
  value: "Beber 3L de água",
  checked: false
}

let metas = [meta]

const cadastrarMeta = async () => {
  const titulo = await input({ message: "Digite o título da meta:" })

  if (titulo.length === 0) {
    console.log("Título inválido!")
    return
  }

  metas.push({
    value: titulo,
    checked: false
  })
}

const listarMetas = async () => {
  const respostas = await checkbox({
    message: "",
    choices: [...metas],
  })

  if (respostas.length === 0) {
    console.log("Nenhuma meta selecionada.")
    return
  }

  metas.forEach(meta => {
    meta.checked = false
  })

  respostas.forEach(resposta => {
    const meta = metas.find(m => {
      return m.value === resposta
    })

    meta.checked = true

  })

  console.log("Meta(s) marcada(s) como concluída(s)")
}

const start = async () => {
  while (true) {
    const opcao = await select({
      message: "Menu >",
      choices: [
        {
          name: "Cadastrar meta",
          value: "cadastrar"
        },
        {
          name: "Listar metas",
          value: "listar"
        },
        {
          name: "Sair",
          value: "sair"
        }
      ]
    })

    switch (opcao) {
      case "cadastrar":
        await cadastrarMeta()
        console.log(metas)
        break;
      case "listar":
        await listarMetas()
        break;
      case "sair":
        console.log("Até mais!")
        return
    }
  }
}

start()