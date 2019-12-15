using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Entity_Visualiser.Models
{
    public class DBSchemaInfo
    {
        public List<Links> links { get; set; }
        public List<Nodes> nodes { get; set; }
    }
}