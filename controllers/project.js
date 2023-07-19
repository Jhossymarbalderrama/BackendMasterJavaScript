"use strict";

var Project = require("../models/project");
var fs = require("fs");
var path = require("path");

var controller = {
  home: function (req, res) {
    return res.status(200).send({
      message: "Soy la home",
    });
  },

  test: function (req, res) {
    return res.status(200).send({
      message: "Soy el metodo o accion test del controlador de project",
    });
  },

  saveProject: async function (req, res) {
    var project = new Project();

    var params = req.body;
    project.name = params.name;
    project.description = params.description;
    project.category = params.category;
    project.year = params.year;
    project.langs = params.langs;
    project.image = null;

    try {
      await project.save();
      return res.status(200).send({ project });
    } catch (error) {
      console.log(error);
      return res.status(500).send({ message: "Error al guardar el objeto" });
    }
  },

  getProject: async function (req, res) {
    try {
      var projectId = req.params.id;
      const projects = await Project.find({});
      let projectoBD;

      if (projectId == null)
        return res.status(404).send({ message: "El proyecto no existe." });

      for (let i = 0; i < projects.length; i++) {
        if (projects[i].id == projectId) projectoBD = projects[i];
      }

      if (projectoBD) return res.status(200).send(projectoBD);
      else if (!projectoBD)
        return res.status(404).send({ message: "El proyecto no existe." });
      else
        return res
          .status(500)
          .send({ message: "Error al devolver los datos." });
    } catch (error) {
      console.log(error);
      return res.status(500).send({ message: "Error al devolver los datos." });
    }
  },

  getProjects: async function (req, res) {
    try {
      const projects = await Project.find({});

      if (projects) return res.status(200).send({ projects });
      else if (!projects)
        return res
          .status(404)
          .send({ message: "No hay projectos que mostrar." });
      else
        return res
          .status(500)
          .send({ message: "Error al devolver los datos." });
    } catch (error) {
      console.log(error);
      return res.status(500).send({ message: "Error al devolver los datos." });
    }
  },

  updateProject: function (req, res) {
    var projectId = req.params.id;
    var update = req.body;

    Project.findByIdAndUpdate(projectId, update, { new: true })
      .then((projectUpdated) => {
        return res.status(200).send({ project: projectUpdated });
      })
      .catch(() => {
        return res
          .status(400)
          .send({ message: "No existe el proyecto para actualizar" });
      });
  },

  deleteProject: function (req, res) {
    var projectId = req.params.id;

    Project.findByIdAndRemove(projectId)
      .then((projectRemoved) => {
        if (projectRemoved)
          return res.status(200).send({ project: projectRemoved });
      })
      .catch((err, projectRemoved) => {
        if (!projectRemoved)
          return res.status(404).send({
            message: "No se pudo encontrar el proyecto para ser eliminado",
          });

        if (err)
          return res
            .status(500)
            .send({ message: "No se pudo eliminar el proyecto" });
      });
  },

  uploadImage: function (req, res) {
    // console.log("a");
    // console.log(req.files);
    if (req.files) {
      var projectId = req.params.id;
      var fileName = "Imagen no subida...";
      // console.log(projectId);
      // console.log("b");

      if (req.files) {
        var filePath = req.files.image.path;
        var fileSplit = filePath.split("\\");
        var fileName = fileSplit[1];
        var extSplit = fileName.split(".");
        var fileExt = extSplit[1];

        // console.log("c");
        if (
          fileExt == "png" ||
          fileExt == "jpg" ||
          fileExt == "jpeg" ||
          fileExt == "gif"
        ) {
          // console.log("d");
          Project.findByIdAndUpdate(projectId, { image: fileName })
          .then((projectUpdated)=>{
                  // console.log("e");
                    return res.status(200).send({                      
                        project: projectUpdated
                    })
                })
                .catch(()=> {
                    return res.status(404).send({message:'No existe el proyecto'})
                })
        } else {
          fs.unlink(filePath, (err) => {
            return res
              .status(200)
              .send({ message: "La extensión no es valida" });
          });
        }
      }
    }
  },

  getImageFile: function (req, res) {
    var file = req.params.image;
    var path_file = "./uploads/" + file;

    fs.exists(path_file, (exists) => {
      if (exists) {
        return res.sendFile(path.resolve(path_file));
      } else {
        return res.status(200).send({
          message: "No existe la imagen...",
        });
      }
    });
  },
};

module.exports = controller;
