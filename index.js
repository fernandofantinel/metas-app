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
  if (metas.length === 0) {
    console.log("Nenhuma meta cadastrada.")
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
    console.log("Nenhuma meta selecionada.")
    return
  }

  respostas.forEach(resposta => {
    const meta = metas.find(m => {
      return m.value === resposta
    })

    meta.checked = true

  })

  console.log("Meta(s) marcada(s) como concluída(s)")
}

const metasRealizadas = async () => {
  const realizadas = metas.filter(meta => {
    return meta.checked
  })

  if (realizadas.length === 0) {
    console.log("Não existem metas realizadas.")
    return
  }

  await select({
    message: "Metas realizadas: " + realizadas.length,
    choices: [...realizadas]
  })
}

const metasAbertas = async () => {
  const abertas = metas.filter(meta => {
    return !meta.checked
  })

  if (abertas.length === 0) {
    console.log("Não existem metas abertas.")
    return
  }

  await select({
    message: "Metas abertas: " + abertas.length,
    choices: [...abertas]
  })
}

const removerMetas = async () => {
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
    console.log("Nenhuma meta a ser removida.")
    return
  }

  itensARemover.forEach(item => {
    metas = metas.filter(meta => {
      return meta.value !== item
    })
  })

  console.log("Meta(s) removida(s) com sucesso.")
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
        console.log(metas)
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