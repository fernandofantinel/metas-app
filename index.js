const { select, input, checkbox, } = require('@inquirer/prompts')
const fs = require("fs").promises

let mensagem = "Bem-vindo(a) ao app Metas!"

let metas

const carregarMetas = async () => {
  try {
    const dados = await fs.readFile("metas.json", "utf-8")
    metas = JSON.parse(dados)
  } catch (erro) {
    metas = []
  }
}

const salvarMetas = async () => {
  await fs.writeFile("metas.json", JSON.stringify(metas, null, 2))
}

const cadastrarMeta = async () => {
  const titulo = await input({ message: "Digite o título da meta:" })

  if (titulo.length === 0) {
    mensagem = "Título inválido!"
    return
  }

  metas.push({
    value: titulo,
    checked: false
  })

  mensagem = "Meta cadastrada com sucesso."
}

const listarMetas = async () => {
  if (metas.length === 0) {
    mensagem = "Nenhuma meta cadastrada."
    return
  }

  const respostas = await checkbox({
    message: "",
    choices: [...metas],
  })

  metas.forEach(meta => {
    meta.checked = false
  })

  if (respostas.length === 0) {
    mensagem = "Nenhuma meta selecionada."
    return
  }

  respostas.forEach(resposta => {
    const meta = metas.find(m => {
      return m.value === resposta
    })

    meta.checked = true

  })

  mensagem = "Meta(s) marcada(s) como concluída(s)"
}

const metasRealizadas = async () => {
  if (metas.length === 0) {
    mensagem = "Nenhuma meta cadastrada."
    return
  }

  const realizadas = metas.filter(meta => {
    return meta.checked
  })

  if (realizadas.length === 0) {
    mensagem = "Não existem metas realizadas."
    return
  }

  await select({
    message: "Metas realizadas: " + realizadas.length,
    choices: [...realizadas]
  })
}

const metasAbertas = async () => {
  if (metas.length === 0) {
    mensagem = "Nenhuma meta cadastrada."
    return
  }

  const abertas = metas.filter(meta => {
    return !meta.checked
  })

  if (abertas.length === 0) {
    mensagem = "Não existem metas abertas."
    return
  }

  await select({
    message: "Metas abertas: " + abertas.length,
    choices: [...abertas]
  })
}

const removerMetas = async () => {
  if (metas.length === 0) {
    mensagem = "Nenhuma meta cadastrada."
    return
  }

  const metasDesmarcadas = metas.map(meta => {
    return {
      value: meta.value,
      checked: false
    }
  })

  const itensARemover = await checkbox({
    message: "Selecione uma meta para ser removida",
    choices: [...metasDesmarcadas]
  })

  if (itensARemover.length === 0) {
    mensagem = "Nenhuma meta a ser removida."
    return
  }

  itensARemover.forEach(item => {
    metas = metas.filter(meta => {
      return meta.value !== item
    })
  })

  mensagem = "Meta(s) removida(s) com sucesso."
}

const mostrarMensagem = () => {
  console.clear()

  if (mensagem !== "") {
    console.log(mensagem)
    console.log("")
    mensagem = ""
  }
}

const start = async () => {
  await carregarMetas()

  while (true) {
    await salvarMetas()
    mostrarMensagem()

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
          name: "Metas realizadas",
          value: "realizadas"
        },
        {
          name: "Metas abertas",
          value: "abertas"
        },
        {
          name: "Remover metas",
          value: "remover"
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
        break;
      case "listar":
        await listarMetas()
        break;
      case "realizadas":
        await metasRealizadas()
        break;
      case "abertas":
        await metasAbertas()
        break;
      case "remover":
        await removerMetas()
        break;
      case "sair":
        console.log("Até mais!")
        return
    }
  }
}

start()