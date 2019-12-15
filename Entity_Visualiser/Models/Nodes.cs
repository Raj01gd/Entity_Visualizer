using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Entity_Visualiser.Models
{
    public class Nodes
    {
        public string Table { get; set; }

        public List<Columns> columns { get; set; }
    }
}